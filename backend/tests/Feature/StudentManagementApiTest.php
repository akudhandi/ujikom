<?php

namespace Tests\Feature;

use App\Models\Faculty;
use App\Models\StudyProgram;
use App\Models\User;
use Database\Seeders\AcademicMasterSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class StudentManagementApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_master_faculties_endpoint_returns_nine_faculties_and_forty_programs(): void
    {
        $this->seed(AcademicMasterSeeder::class);

        $response = $this->getJson('/api/faculties');

        $response->assertOk()
            ->assertJsonCount(9, 'data');

        $totalPrograms = collect($response->json('data'))
            ->sum(fn (array $faculty): int => count($faculty['study_programs']));

        $this->assertSame(40, $totalPrograms);
    }

    public function test_admin_can_login_with_username_and_logout(): void
    {
        User::factory()->create([
            'name' => 'Administrator UCN',
            'username' => 'admin',
            'email' => 'admin@ucn.ac.id',
            'password' => Hash::make('admin123'),
        ]);

        $loginResponse = $this->postJson('/api/login', [
            'identifier' => 'admin',
            'password' => 'admin123',
        ]);

        $loginResponse->assertOk()
            ->assertJsonPath('user.username', 'admin')
            ->assertJsonStructure(['message', 'token', 'user']);

        $token = (string) $loginResponse->json('token');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('user.username', 'admin');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/logout')
            ->assertOk();
    }

    public function test_guest_cannot_access_admin_student_endpoints(): void
    {
        $this->getJson('/api/admin/students')->assertUnauthorized();
        $this->postJson('/api/admin/students', [])->assertUnauthorized();
    }

    public function test_admin_can_create_update_deactivate_and_reactivate_student_and_dashboard_aggregates_update(): void
    {
        $this->seed(AcademicMasterSeeder::class);

        $admin = User::factory()->create([
            'username' => 'admin',
        ]);

        $fasilkom = Faculty::query()->where('code', 'FASILKOM')->firstOrFail();
        $feb = Faculty::query()->where('code', 'FEB')->firstOrFail();
        $informatika = StudyProgram::query()
            ->where('faculty_id', $fasilkom->id)
            ->where('name', 'Teknik Informatika')
            ->firstOrFail();
        $manajemen = StudyProgram::query()
            ->where('faculty_id', $feb->id)
            ->where('name', 'Manajemen')
            ->firstOrFail();

        $createResponse = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/students', [
            'name' => 'Budi Santoso',
            'npm' => '2410119001',
            'ktp_address' => 'Jl. Merdeka No. 10, Kota Surabaya',
            'origin_region' => 'Kota Surabaya, Jawa Timur',
            'faculty_id' => $fasilkom->id,
            'study_program_id' => $informatika->id,
            'date_of_birth' => '2005-04-12',
            'gender' => 'male',
        ]);

        $createResponse->assertCreated()
            ->assertJsonPath('data.status', 'active')
            ->assertJsonPath('data.npm', '2410119001');

        $studentId = (int) $createResponse->json('data.id');

        // Program studi dari fakultas berbeda harus ditolak (BR-09)
        $this->actingAs($admin, 'sanctum')->postJson('/api/admin/students', [
            'name' => 'Salah Prodi',
            'npm' => '2410119002',
            'ktp_address' => 'Jl. Merdeka No. 11, Kota Surabaya',
            'origin_region' => 'Kota Surabaya, Jawa Timur',
            'faculty_id' => $fasilkom->id,
            'study_program_id' => $manajemen->id,
            'date_of_birth' => '2005-04-12',
            'gender' => 'female',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['study_program_id']);

        // Dashboard publik hanya menghitung mahasiswa aktif dan tidak membocorkan alamat KTP (BR-05, BR-12)
        $dashboardResponse = $this->getJson('/api/dashboard');
        $dashboardResponse->assertOk()
            ->assertJsonPath('summary.total_active_students', 1)
            ->assertJsonPath('summary.male_count', 1)
            ->assertJsonPath('summary.female_count', 0);
        $this->assertStringNotContainsString('Jl. Merdeka No. 10', $dashboardResponse->getContent());

        // Nonaktifkan mahasiswa (BR-03, BR-14)
        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/students/{$studentId}/status", ['status' => 'inactive'])
            ->assertOk()
            ->assertJsonPath('data.status', 'inactive');

        $this->assertDatabaseHas('students', [
            'id' => $studentId,
            'status' => 'inactive',
        ]);

        // Dashboard langsung turun ke 0 mahasiswa aktif
        $this->getJson('/api/dashboard')
            ->assertOk()
            ->assertJsonPath('summary.total_active_students', 0);

        // NPM mahasiswa nonaktif tetap tidak boleh dipakai mahasiswa baru (BR-08)
        $this->actingAs($admin, 'sanctum')->postJson('/api/admin/students', [
            'name' => 'Duplikat NPM',
            'npm' => '2410119001',
            'ktp_address' => 'Jl. Pahlawan No. 99, Kota Bandung',
            'origin_region' => 'Kota Bandung, Jawa Barat',
            'faculty_id' => $fasilkom->id,
            'study_program_id' => $informatika->id,
            'date_of_birth' => '2005-04-12',
            'gender' => 'male',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['npm']);

        // Aktifkan kembali (BR-07)
        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/students/{$studentId}/status", ['status' => 'active'])
            ->assertOk()
            ->assertJsonPath('data.status', 'active');

        $this->getJson('/api/dashboard')
            ->assertOk()
            ->assertJsonPath('summary.total_active_students', 1);
    }
}
