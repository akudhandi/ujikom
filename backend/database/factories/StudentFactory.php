<?php

namespace Database\Factories;

use App\Models\Faculty;
use App\Models\Student;
use App\Models\StudyProgram;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'npm' => fake()->unique()->numerify('24#########'),
            'ktp_address' => 'Jl. '.fake()->streetName().' No. '.fake()->buildingNumber().', RT 02/RW 04',
            'origin_region' => fake()->randomElement([
                'Kota Bandung, Jawa Barat',
                'Kota Surabaya, Jawa Timur',
                'Kota Jakarta Selatan, DKI Jakarta',
                'Kota Semarang, Jawa Tengah',
                'Kota Yogyakarta, DI Yogyakarta',
            ]),
            'faculty_id' => Faculty::factory(),
            'study_program_id' => function (array $attributes): int {
                return StudyProgram::factory()->create([
                    'faculty_id' => $attributes['faculty_id'],
                ])->id;
            },
            'date_of_birth' => fake()->dateTimeBetween('-26 years', '-18 years')->format('Y-m-d'),
            'gender' => fake()->randomElement(['male', 'female']),
            'status' => 'active',
            'deactivated_at' => null,
            'deactivated_by' => null,
        ];
    }
}
