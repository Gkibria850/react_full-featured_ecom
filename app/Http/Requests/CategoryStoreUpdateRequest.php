<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryStoreUpdateRequest extends FormRequest
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
            // 'slug' => 'nullable|string|max:255|unique:categories,slug,' . $this->route('category')->id,
            'image' => 'nullable|image|mimes:jpeg,jpg,png,svg|max:2048',
            'description' => 'nullable|string|max:1000', // Assuming longer description
            'des_short' => 'nullable|string|max:255',
            'status' => 'nullable|in:0,1',
            'parent_id' => 'nullable|exists:categories,id',
        ];
    }

}
