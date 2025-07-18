<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BrandStoreUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:255',
            //'slug' => 'nullable|string|max:255|unique:brands,slug,' . $this->route('brand')->id,
            'image' => 'nullable|image|mimes:jpeg,jpg,png,svg|max:2048',
            'description' => 'nullable|string|max:1000', // Assuming longer description
            'status' => 'nullable|in:0,1',
          
        ];
    }
}
