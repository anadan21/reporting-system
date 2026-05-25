<?php

use App\Http\Controllers\Api\Public\ReportController as PublicReportController;
use App\Http\Controllers\Api\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ForgotPasswordController;
use Illuminate\Support\Facades\Route;

// Kirim laporan kendala baru
Route::post('/reports', [PublicReportController::class, 'store'])
    ->middleware('throttle:10,60');

// 🛠️ PERBAIKAN: Jalur pelacakan tiket publik diletakkan di SINI (di luar grup admin)
Route::get('/reports/track/{ticket}', [PublicReportController::class, 'track']);

// Login Admin
Route::post('/login', [AuthController::class, 'login']);

// Fitur Lupa Password
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);


Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::get('/reports', [AdminReportController::class, 'index']);
    Route::get('/reports/{report}', [AdminReportController::class, 'show']);
    Route::patch('/reports/{report}/status', [AdminReportController::class, 'updateStatus']);
    Route::post('/reports/{report}/notes', [AdminReportController::class, 'addNote']);
    Route::delete('/reports/{report}', [AdminReportController::class, 'destroy']);
    
});
