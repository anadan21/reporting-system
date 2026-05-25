<?php

namespace App\Http\Requests\Admin;

use App\Enums\ReportStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', new Enum(ReportStatusEnum::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Status wajib dipilih.',
            'status'          => 'Status tidak valid. Pilih: open, in_progress, atau done.',
        ];
    }
}