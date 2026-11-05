<?php

namespace App\Http\Requests;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(Order::STAFF_STATUSES)],
            'expected_status' => ['nullable', Rule::in(Order::STAFF_STATUSES)],
            'reason' => ['nullable', 'required_if:status,cancelled,rejected', 'string', 'max:500'],
        ];
    }
}
