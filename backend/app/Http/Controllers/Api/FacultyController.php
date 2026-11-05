<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use Illuminate\Http\JsonResponse;

class FacultyController extends Controller
{
    /**
     * Daftar master fakultas beserta program studi dan jumlah mahasiswa aktif.
     */
    public function index(): JsonResponse
    {
        $faculties = Faculty::query()
            ->with([
                'studyPrograms' => fn ($query) => $query
                    ->withCount([
                        'students as active_students_count' => fn ($q) => $q->where('status', 'active'),
                    ])
                    ->orderBy('id'),
            ])
            ->withCount([
                'students as active_students_count' => fn ($q) => $q->where('status', 'active'),
            ])
            ->orderBy('id')
            ->get()
            ->map(fn (Faculty $faculty): array => [
                'id' => $faculty->id,
                'code' => $faculty->code,
                'name' => $faculty->name,
                'active_students_count' => (int) $faculty->active_students_count,
                'study_programs' => $faculty->studyPrograms->map(fn ($program): array => [
                    'id' => $program->id,
                    'faculty_id' => $program->faculty_id,
                    'degree' => $program->degree,
                    'name' => $program->name,
                    'active_students_count' => (int) $program->active_students_count,
                ])->values()->all(),
            ])
            ->values();

        return response()->json([
            'data' => $faculties,
        ]);
    }
}
