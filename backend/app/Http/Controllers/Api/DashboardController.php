<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use App\Models\Student;
use App\Models\StudyProgram;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Ambil statistik agregat mahasiswa aktif untuk dashboard publik & admin.
     */
    public function index(): JsonResponse
    {
        $activeStudents = Student::query()
            ->active()
            ->select(['id', 'gender', 'origin_region', 'faculty_id', 'study_program_id', 'date_of_birth'])
            ->get();

        $totalActive = $activeStudents->count();
        $maleCount = $activeStudents->where('gender', 'male')->count();
        $femaleCount = $activeStudents->where('gender', 'female')->count();
        $malePercentage = $totalActive > 0 ? round(($maleCount / $totalActive) * 100, 1) : 0.0;
        $femalePercentage = $totalActive > 0 ? round(($femaleCount / $totalActive) * 100, 1) : 0.0;

        $genderDistribution = [
            [
                'key' => 'male',
                'label' => 'Laki-laki',
                'count' => $maleCount,
                'percentage' => $malePercentage,
            ],
            [
                'key' => 'female',
                'label' => 'Perempuan',
                'count' => $femaleCount,
                'percentage' => $femalePercentage,
            ],
        ];

        $originCounts = $activeStudents
            ->groupBy(fn (Student $student): string => trim($student->origin_region))
            ->map(fn ($group): int => $group->count())
            ->sortDesc();

        $topOrigins = $originCounts->take(10);
        $remainingOriginsCount = $originCounts->slice(10)->sum();

        $originDistribution = $topOrigins->map(fn (int $count, string $region): array => [
            'region' => $region,
            'count' => $count,
            'percentage' => $totalActive > 0 ? round(($count / $totalActive) * 100, 1) : 0.0,
        ])->values()->all();

        if ($remainingOriginsCount > 0) {
            $originDistribution[] = [
                'region' => 'Daerah lainnya',
                'count' => (int) $remainingOriginsCount,
                'percentage' => $totalActive > 0 ? round(($remainingOriginsCount / $totalActive) * 100, 1) : 0.0,
            ];
        }

        $faculties = Faculty::query()
            ->with(['studyPrograms' => fn ($query) => $query->orderBy('id')])
            ->orderBy('id')
            ->get();

        $byFaculty = $activeStudents->groupBy('faculty_id');
        $byProgram = $activeStudents->groupBy('study_program_id');

        $facultyDistribution = $faculties->map(function (Faculty $faculty) use ($byFaculty, $byProgram, $totalActive): array {
            $facultyCount = $byFaculty->get($faculty->id)?->count() ?? 0;

            return [
                'id' => $faculty->id,
                'code' => $faculty->code,
                'name' => $faculty->name,
                'count' => $facultyCount,
                'percentage' => $totalActive > 0 ? round(($facultyCount / $totalActive) * 100, 1) : 0.0,
                'study_programs' => $faculty->studyPrograms->map(function (StudyProgram $program) use ($byProgram, $totalActive): array {
                    $programCount = $byProgram->get($program->id)?->count() ?? 0;

                    return [
                        'id' => $program->id,
                        'degree' => $program->degree,
                        'name' => $program->name,
                        'count' => $programCount,
                        'percentage' => $totalActive > 0 ? round(($programCount / $totalActive) * 100, 1) : 0.0,
                    ];
                })->values()->all(),
            ];
        })->values()->all();

        $ageBuckets = [
            '17–20 tahun' => 0,
            '21–23 tahun' => 0,
            '24–26 tahun' => 0,
            '27 tahun ke atas' => 0,
        ];

        $nowJakarta = Carbon::now('Asia/Jakarta');

        foreach ($activeStudents as $student) {
            $birth = $student->date_of_birth instanceof Carbon
                ? $student->date_of_birth->copy()->timezone('Asia/Jakarta')
                : Carbon::parse((string) $student->date_of_birth, 'Asia/Jakarta');

            $age = (int) $birth->diffInYears($nowJakarta);

            if ($age <= 20) {
                $ageBuckets['17–20 tahun']++;
            } elseif ($age <= 23) {
                $ageBuckets['21–23 tahun']++;
            } elseif ($age <= 26) {
                $ageBuckets['24–26 tahun']++;
            } else {
                $ageBuckets['27 tahun ke atas']++;
            }
        }

        $ageDistribution = collect($ageBuckets)->map(fn (int $count, string $range): array => [
            'range' => $range,
            'count' => $count,
            'percentage' => $totalActive > 0 ? round(($count / $totalActive) * 100, 1) : 0.0,
        ])->values()->all();

        $activeFacultiesCount = collect($facultyDistribution)
            ->filter(fn (array $item): bool => $item['count'] > 0)
            ->count();

        return response()->json([
            'summary' => [
                'total_active_students' => $totalActive,
                'male_count' => $maleCount,
                'female_count' => $femaleCount,
                'male_percentage' => $malePercentage,
                'female_percentage' => $femalePercentage,
                'total_faculties' => $faculties->count(),
                'active_faculties_count' => $activeFacultiesCount,
                'total_study_programs' => StudyProgram::query()->count(),
                'generated_at' => $nowJakarta->toIso8601String(),
            ],
            'gender_distribution' => $genderDistribution,
            'origin_distribution' => $originDistribution,
            'faculty_distribution' => $facultyDistribution,
            'age_distribution' => $ageDistribution,
        ]);
    }
}
