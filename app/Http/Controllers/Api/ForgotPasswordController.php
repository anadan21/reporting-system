<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

class ForgotPasswordController extends Controller
{
    // Tahap 1: Kirim Token / Link ke Email
    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Email tidak terdaftar.'], 404);
        }

        // Buat token acak dan simpan ke tabel password_reset_tokens
        $token = Str::random(60);
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            ['token' => Hash::make($token), 'created_at' => now()]
        );

        // Simulasi cetak token di log atau kirim email asli
        // Nantinya link ini akan mengarah ke alamat Frontend Anda (Port 5173)
        $resetUrl = "http://localhost:5173/reset-password?token=" . $token . "&email=" . $request->email;

        // Sementara kita return dalam JSON agar mudah dicoba di Thunder Client
        return response()->json([
            'message' => 'Link reset password berhasil dibuat.',
            'reset_url' => $resetUrl
        ]);
    }

    // Tahap 2: Proses Eksekusi Ubah Password Baru
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed', // Harus ada password_confirmation
        ]);

        $record = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json(['message' => 'Token reset tidak valid atau kedaluwarsa.'], 400);
        }

        // Update password user
        $user = User::where('email', $request->email)->first();
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        // Hapus token yang sudah dipakai
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password Anda berhasil diperbarui. Silakan login kembali.']);
    }
}
