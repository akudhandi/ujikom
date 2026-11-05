<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    /**
     * Seed akun administrator dari konfigurasi environment.
     */
    public function run(): void
    {
        $username = (string) config('auth.admin.username', 'admin');
        $email = (string) config('auth.admin.email', 'admin@ucn.ac.id');
        $name = (string) config('auth.admin.name', 'Administrator UCN');
        $rawPassword = (string) (config('auth.admin.password') ?: Str::random(24));

        User::query()->updateOrCreate(
            ['username' => $username],
            [
                'name' => $name,
                'email' => $email,
                'role' => 'admin',
                'password' => Hash::make($rawPassword),
                'email_verified_at' => now(),
            ],
        );
    }
}
