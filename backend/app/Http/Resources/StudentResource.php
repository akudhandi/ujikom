<?php

namespace App\Http\Resources;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Student
 */
class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'npm' => $this->npm,
            'ktp_address' => $this->ktp_address,
            'origin_region' => $this->origin_region,
            'faculty_id' => $this->faculty_id,
            'study_program_id' => $this->study_program_id,
            'faculty' => $this->whenLoaded('faculty', fn (): array => [
                'id' => $this->faculty->id,
                'code' => $this->faculty->code,
                'name' => $this->faculty->name,
            ]),
            'study_program' => $this->whenLoaded('studyProgram', fn (): array => [
                'id' => $this->studyProgram->id,
                'degree' => $this->studyProgram->degree,
                'name' => $this->studyProgram->name,
            ]),
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'age' => $this->age,
            'gender' => $this->gender,
            'gender_label' => $this->gender === 'male' ? 'Laki-laki' : 'Perempuan',
            'status' => $this->status,
            'status_label' => $this->status === 'active' ? 'Aktif' : 'Nonaktif',
            'deactivated_at' => $this->deactivated_at?->toIso8601String(),
            'deactivated_by' => $this->whenLoaded('deactivatedBy', fn (): ?array => $this->deactivatedBy ? [
                'id' => $this->deactivatedBy->id,
                'name' => $this->deactivatedBy->name,
                'username' => $this->deactivatedBy->username,
            ] : null),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
