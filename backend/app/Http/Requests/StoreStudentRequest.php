<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStudentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $merged = [];

        foreach (['name', 'npm', 'ktp_address', 'origin_region'] as $field) {
            if (is_string($this->input($field))) {
                $merged[$field] = preg_replace('/\s+/u', ' ', trim((string) $this->input($field)));
            }
        }

        if ($merged !== []) {
            $this->merge($merged);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $todayJakarta = Carbon::now('Asia/Jakarta')->toDateString();

        return [
            'name' => ['required', 'string', 'min:2', 'max:150'],
            'npm' => ['required', 'string', 'digits:11', 'regex:/^\d{11}$/', Rule::unique('students', 'npm')],
            'ktp_address' => ['required', 'string', 'min:5', 'max:500'],
            'origin_region' => ['required', 'string', 'min:2', 'max:150'],
            'faculty_id' => ['required', 'integer', Rule::exists('faculties', 'id')],
            'study_program_id' => [
                'required',
                'integer',
                Rule::exists('study_programs', 'id')->where(
                    fn ($query) => $query->where('faculty_id', $this->input('faculty_id')),
                ),
            ],
            'date_of_birth' => ['required', 'date', 'before_or_equal:'.$todayJakarta],
            'gender' => ['required', 'string', Rule::in(['male', 'female'])],
        ];
    }

    /**
     * Custom validation messages in Indonesian.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama mahasiswa wajib diisi.',
            'name.min' => 'Nama mahasiswa minimal 2 karakter.',
            'npm.required' => 'NPM wajib diisi.',
            'npm.digits' => 'NPM wajib berupa angka dengan panjang tepat 11 digit.',
            'npm.regex' => 'NPM hanya boleh berisi angka (11 digit).',
            'npm.unique' => 'NPM sudah terdaftar pada data mahasiswa (aktif atau nonaktif).',
            'ktp_address.required' => 'Alamat sesuai KTP wajib diisi.',
            'ktp_address.min' => 'Alamat sesuai KTP minimal 5 karakter.',
            'origin_region.required' => 'Asal daerah wajib diisi.',
            'faculty_id.required' => 'Fakultas wajib dipilih.',
            'faculty_id.exists' => 'Fakultas yang dipilih tidak valid.',
            'study_program_id.required' => 'Program studi wajib dipilih.',
            'study_program_id.exists' => 'Program studi harus sesuai dengan fakultas yang dipilih.',
            'date_of_birth.required' => 'Tanggal lahir wajib diisi.',
            'date_of_birth.before_or_equal' => 'Tanggal lahir tidak boleh di masa depan.',
            'gender.required' => 'Jenis kelamin wajib dipilih.',
            'gender.in' => 'Jenis kelamin harus laki-laki (male) atau perempuan (female).',
        ];
    }
}
