<?php

use App\Http\Controllers\Api\AdminStudentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FacultyController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'message' => 'Laravel API siap.',
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index']);
Route::get('/faculties', [FacultyController::class, 'index']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/user', [AuthController::class, 'me']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/admin/students', [AdminStudentController::class, 'index']);
    Route::post('/admin/students', [AdminStudentController::class, 'store']);
    Route::get('/admin/students/{student}', [AdminStudentController::class, 'show']);
    Route::put('/admin/students/{student}', [AdminStudentController::class, 'update']);
    Route::patch('/admin/students/{student}/status', [AdminStudentController::class, 'updateStatus']);
});
