<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reporter_name'  => ['required', 'string', 'max:100'],
            'reporter_email' => ['required', 'email', 'max:100'],
            'reporter_phone' => ['nullable', 'string', 'max:20'],
            'unit_business'  => ['required', 'string', 'max:100'],
            'division_name'  => ['required', 'string', 'max:100'],
            'unit_location'  => ['required', 'string', 'max:100'],
            'title'          => ['required', 'string', 'max:200'],
            'description'    => ['required', 'string', 'min:10'],
            'attachment_path'=> ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf,doc,docx', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'reporter_name.required'  => 'Nama lengkap wajib diisi.',
            'reporter_email.required' => 'Email wajib diisi.',
            'reporter_email.email'    => 'Format email tidak valid.',
            'unit_business.required'  => 'Unit usaha wajib dipilih atau diisi.',
            'unit_location.required'  => 'Lokasi unit wajib dipilih atau diisi.',
            'division_name.required'  => 'Nama divisi wajib diisi.',
            'title.required'          => 'Judul kendala wajib diisi.',
            'description.required'    => 'Deskripsi kendala wajib diisi.',
            'description.min'         => 'Deskripsi minimal 10 karakter.',
            'attachment_path.mimes'   => 'File harus berformat jpg, png, pdf, doc, atau docx.',
            'attachment_path.max'     => 'Ukuran file maksimal 5MB.',
        ];
    }
}
