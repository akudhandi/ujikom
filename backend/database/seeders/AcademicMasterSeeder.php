<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\StudyProgram;
use Illuminate\Database\Seeder;

class AcademicMasterSeeder extends Seeder
{
    /**
     * Seed master data fakultas dan program studi.
     */
    public function run(): void
    {
        $catalog = [
            [
                'code' => 'FEB',
                'name' => 'Fakultas Ekonomi dan Bisnis (FEB)',
                'programs' => [
                    ['degree' => 'S1', 'name' => 'Ekonomi Pembangunan'],
                    ['degree' => 'S1', 'name' => 'Manajemen'],
                    ['degree' => 'S1', 'name' => 'Akuntansi'],
                    ['degree' => 'S1', 'name' => 'Kewirausahaan'],
                ],
            ],
            [
                'code' => 'FT',
                'name' => 'Fakultas Teknik dan Sains (FT)',
                'programs' => [
                    ['degree' => 'S1', 'name' => 'Teknik Industri'],
                    ['degree' => 'S1', 'name' => 'Teknik Kimia'],
                    ['degree' => 'S1', 'name' => 'Teknologi Pangan'],
                    ['degree' => 'S1', 'name' => 'Teknik Sipil'],
                    ['degree' => 'S1', 'name' => 'Teknik Lingkungan'],
                    ['degree' => 'S1', 'name' => 'Teknik Mesin'],
                    ['degree' => 'S1', 'name' => 'Fisika'],
                ],
            ],
            [
                'code' => 'FASILKOM',
                'name' => 'Fakultas Ilmu Komputer (FASILKOM)',
                'programs' => [
                    ['degree' => 'S1', 'name' => 'Teknik Informatika'],
                    ['degree' => 'S1', 'name' => 'Sistem Informasi'],
                    ['degree' => 'S1', 'name' => 'Sains Data'],
                    ['degree' => 'S1', 'name' => 'Bisnis Digital'],
                ],
            ],
            [
                'code' => 'FAPERTA',
                'name' => 'Fakultas Pertanian (FAPERTA)',
                'programs' => [
                    ['degree' => 'S1', 'name' => 'Agroteknologi'],
                    ['degree' => 'S1', 'name' => 'Agribisnis'],
                ],
            ],
            [
                'code' => 'FISIP',
                'name' => 'Fakultas Ilmu Sosial dan Ilmu Politik (FISIP)',
                'programs' => [
                    ['degree' => 'S1', 'name' => 'Administrasi Negara (Administrasi Publik)'],
                    ['degree' => 'S1', 'name' => 'Administrasi Bisnis'],
                    ['degree' => 'S1', 'name' => 'Ilmu Komunikasi'],
                    ['degree' => 'S1', 'name' => 'Hubungan Internasional'],
                    ['degree' => 'S1', 'name' => 'Pariwisata'],
                    ['degree' => 'S1', 'name' => 'Linguistik Indonesia'],
                    ['degree' => 'D4', 'name' => 'Bahasa Inggris untuk Komunikasi Bisnis dan Profesional (D4)'],
                ],
            ],
            [
                'code' => 'FAD',
                'name' => 'Fakultas Arsitektur dan Desain (FAD)',
                'programs' => [
                    ['degree' => 'S1', 'name' => 'Arsitektur'],
                    ['degree' => 'S1', 'name' => 'Desain Komunikasi Visual (DKV)'],
                    ['degree' => 'S1', 'name' => 'Desain Interior'],
                ],
            ],
            [
                'code' => 'FH',
                'name' => 'Fakultas Hukum (FH)',
                'programs' => [
                    ['degree' => 'S1', 'name' => 'Ilmu Hukum'],
                ],
            ],
            [
                'code' => 'FK',
                'name' => 'Fakultas Kedokteran (FK)',
                'programs' => [
                    ['degree' => 'S1', 'name' => 'Pendidikan Dokter'],
                    ['degree' => 'Profesi', 'name' => 'Profesi Dokter'],
                ],
            ],
            [
                'code' => 'PASCASARJANA',
                'name' => 'Program Pascasarjana (S2 & S3)',
                'programs' => [
                    ['degree' => 'S2', 'name' => 'S2 (Magister) Agribisnis'],
                    ['degree' => 'S2', 'name' => 'S2 (Magister) Agroteknologi'],
                    ['degree' => 'S2', 'name' => 'S2 (Magister) Akuntansi'],
                    ['degree' => 'S2', 'name' => 'S2 (Magister) Hukum'],
                    ['degree' => 'S2', 'name' => 'S2 (Magister) Ilmu Komunikasi'],
                    ['degree' => 'S2', 'name' => 'S2 (Magister) Ilmu Lingkungan'],
                    ['degree' => 'S2', 'name' => 'S2 (Magister) Manajemen'],
                    ['degree' => 'S2', 'name' => 'S2 (Magister) Teknologi Informasi'],
                    ['degree' => 'S3', 'name' => 'S3 (Doktor) Agribisnis'],
                    ['degree' => 'S3', 'name' => 'S3 (Doktor) Ilmu Manajemen'],
                ],
            ],
        ];

        foreach ($catalog as $entry) {
            $faculty = Faculty::query()->updateOrCreate(
                ['code' => $entry['code']],
                ['name' => $entry['name']],
            );

            foreach ($entry['programs'] as $program) {
                StudyProgram::query()->updateOrCreate(
                    [
                        'faculty_id' => $faculty->id,
                        'name' => $program['name'],
                    ],
                    [
                        'degree' => $program['degree'],
                    ],
                );
            }
        }
    }
}
