<?php

namespace App\Http\Requests;

use App\Models\Branch;
use App\Models\AppSetting;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['payment_method' => $this->input('payment_method', 'cash')]);
    }

    public function rules(): array
    {
        return [
            'branch_id' => ['required', 'integer', 'exists:branches,id'],
            'order_type' => ['required', Rule::in(['delivery', 'pickup', 'dine_in'])],
            'customer_name' => ['required', 'string', 'min:2', 'max:100'],
            'customer_phone' => ['required', 'string', 'max:40'],
            'delivery_address' => ['nullable', 'required_if:order_type,delivery', 'string', 'max:500'],
            'pickup_time' => ['nullable', 'required_if:order_type,pickup', 'date'],
            'payment_method' => ['required', Rule::in(['cash', 'card'])],
            'idempotency_key' => ['nullable', 'string', 'max:100'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.menu_item_id' => ['required', 'integer', 'exists:menu_items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:20'],
            'items.*.notes' => ['nullable', 'string', 'max:200'],
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator): void {
            if ($this->input('order_type') !== 'pickup' || ! $this->input('pickup_time')) {
                return;
            }

            $arrival = Carbon::parse($this->input('pickup_time'));
            $prepMinutes = (int) AppSetting::valueFor('minimum_pickup_prep_minutes', config('orders.minimum_pickup_prep_minutes', 20));
            $earliest = now()->addMinutes($prepMinutes);

            if ($arrival->lt($earliest)) {
                $validator->errors()->add('pickup_time', "Pickup must be at least {$earliest->diffInMinutes(now())} minutes from now.");

                return;
            }

            $branch = Branch::find($this->integer('branch_id'));
            if ($branch && isset($branch->opens_at, $branch->closes_at)) {
                $time = $arrival->format('H:i:s');
                if ($time < $branch->opens_at || $time > $branch->closes_at) {
                    $validator->errors()->add('pickup_time', 'Pickup time must be within branch opening hours.');
                }
            }
        }];
    }
}
