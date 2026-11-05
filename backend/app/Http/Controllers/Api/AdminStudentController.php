<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Http\Resources\StudentResource;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AdminStudentController extends Controller
{
    /**
     * Tampilkan daftar mahasiswa dengan dukungan pencarian, filter status, dan paginasi.
     */
    public function index(Request $request): JsonResponse
    {
        $status = (string) $request->query('status', 'active');
        $search = trim((string) $request->query('search', ''));
        $facultyId = $request->query('faculty_id');
        $studyProgramId = $request->query('study_program_id');
        $gender = $request->query('gender');
        $perPage = min(max((int) $request->query('per_page', 12), 1), 100);

        $query = Student::query()
            ->with(['faculty', 'studyProgram', 'deactivatedBy']);

        if ($status === 'active' || $status === 'inactive') {
            $query->where('status', $status);
        }

        if ($search !== '') {
            $query->where(function ($subQuery) use ($search): void {
                $subQuery->where('name', 'like', "%{$search}%")
                    ->orWhere('npm', 'like', "%{$search}%")
                    ->orWhere('origin_region', 'like', "%{$search}%");
            });
        }

        if ($facultyId !== null && $facultyId !== '') {
            $query->where('faculty_id', (int) $facultyId);
        }

        if ($studyProgramId !== null && $studyProgramId !== '') {
            $query->where('study_program_id', (int) $studyProgramId);
        }

        if ($gender === 'male' || $gender === 'female') {
            $query->where('gender', $gender);
        }

        $paginator = $query
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate($perPage);

        return response()->json([
            'data' => StudentResource::collection($paginator->getCollection()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'counts' => [
                    'active' => Student::query()->where('status', 'active')->count(),
                    'inactive' => Student::query()->where('status', 'inactive')->count(),
                    'all' => Student::query()->count(),
                ],
            ],
        ]);
    }

    /**
     * Simpan data mahasiswa baru (default status active).
     */
    public function store(StoreStudentRequest $request): JsonResponse
    {
        $student = DB::transaction(function () use ($request): Student {
            return Student::query()->create([
                ...$request->validated(),
                'status' => 'active',
                'deactivated_at' => null,
                'deactivated_by' => null,
            ]);
        });

        $student->load(['faculty', 'studyProgram', 'deactivatedBy']);

        return response()->json([
            'message' => 'Data mahasiswa berhasil ditambahkan.',
            'data' => new StudentResource($student),
        ], 201);
    }

    /**
     * Tampilkan detail lengkap satu mahasiswa untuk admin.
     */
    public function show(Student $student): JsonResponse
    {
        $student->load(['faculty', 'studyProgram', 'deactivatedBy']);

        return response()->json([
            'data' => new StudentResource($student),
        ]);
    }

    /**
     * Perbarui data mahasiswa.
     */
    public function update(UpdateStudentRequest $request, Student $student): JsonResponse
    {
        DB::transaction(function () use ($request, $student): void {
            $student->update($request->validated());
        });

        $student->load(['faculty', 'studyProgram', 'deactivatedBy']);

        return response()->json([
            'message' => 'Data mahasiswa berhasil diperbarui.',
            'data' => new StudentResource($student),
        ]);
    }

    /**
     * Nonaktifkan atau aktifkan kembali data mahasiswa (tanpa hard delete).
     */
    public function updateStatus(Request $request, Student $student): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ]);

        $nextStatus = (string) $validated['status'];

        DB::transaction(function () use ($request, $student, $nextStatus): void {
            if ($nextStatus === 'inactive') {
                $student->update([
                    'status' => 'inactive',
                    'deactivated_at' => now(),
                    'deactivated_by' => $request->user()?->id,
                ]);
            } else {
                $student->update([
                    'status' => 'active',
                    'deactivated_at' => null,
                    'deactivated_by' => null,
                ]);
            }
        });

        $student->load(['faculty', 'studyProgram', 'deactivatedBy']);

        return response()->json([
            'message' => $nextStatus === 'inactive'
                ? 'Data mahasiswa berhasil dinonaktifkan.'
                : 'Data mahasiswa berhasil diaktifkan kembali.',
            'data' => new StudentResource($student),
        ]);
    }
}
