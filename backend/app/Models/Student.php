<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'name',
    'npm',
    'ktp_address',
    'origin_region',
    'faculty_id',
    'study_program_id',
    'date_of_birth',
    'gender',
    'status',
    'deactivated_at',
    'deactivated_by',
])]
class Student extends Model
{
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date:Y-m-d',
            'deactivated_at' => 'datetime',
        ];
    }

    /**
     * Scope hanya mahasiswa berstatus aktif.
     *
     * @param  Builder<Student>  $query
     * @return Builder<Student>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    /**
     * Fakultas tempat mahasiswa terdaftar.
     *
     * @return BelongsTo<Faculty, $this>
     */
    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }

    /**
     * Program studi tempat mahasiswa terdaftar.
     *
     * @return BelongsTo<StudyProgram, $this>
     */
    public function studyProgram(): BelongsTo
    {
        return $this->belongsTo(StudyProgram::class);
    }

    /**
     * Admin yang menonaktifkan data mahasiswa.
     *
     * @return BelongsTo<User, $this>
     */
    public function deactivatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deactivated_by');
    }

    /**
     * Hitung usia dinamis berdasarkan tanggal lahir di zona waktu Asia/Jakarta.
     */
    public function getAgeAttribute(): int
    {
        $birthDate = $this->date_of_birth instanceof Carbon
            ? $this->date_of_birth->copy()->timezone('Asia/Jakarta')
            : Carbon::parse((string) $this->date_of_birth, 'Asia/Jakarta');

        return (int) $birthDate->diffInYears(Carbon::now('Asia/Jakarta'));
    }
}
