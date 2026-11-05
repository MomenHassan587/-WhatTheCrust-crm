<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminSettingsRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->isAdmin() === true; }
    public function rules(): array
    {
        return [
            'default_delivery_fee' => ['required', 'numeric', 'min:0'],
            'minimum_pickup_prep_minutes' => ['required', 'integer', 'min:0', 'max:240'],
            'order_promise_minutes' => ['required', 'integer', 'min:1', 'max:120'],
        ];
    }
}
