<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminProductRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->isAdmin() === true; }

    protected function prepareForValidation(): void
    {
        if (is_string($this->branch_options)) {
            $this->merge(['branch_options' => json_decode($this->branch_options, true)]);
        }
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:160'],
            'description' => ['required', 'string', 'max:1000'],
            'tag' => ['nullable', 'string', 'max:60'],
            'display_order' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:8192'],
            'branch_options' => ['required', 'array', 'min:1'],
            'branch_options.*.branch_id' => ['required', 'integer', 'exists:branches,id'],
            'branch_options.*.price' => ['required', 'numeric', 'min:0', 'max:99999'],
            'branch_options.*.is_available' => ['required', 'boolean'],
        ];
    }
}
