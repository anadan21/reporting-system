<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Login admin
    public function login(LoginRequest $request): JsonResponse
    {
        // Cari user berdasarkan email
        $user = User::where('email', $request->email)->first();

        // Cek password salah
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah.',
            ], 401);
        }

        // Cek apakah akun aktif
        if (! $user->is_active) {
            return response()->json([
                'message' => 'Akun kamu dinonaktifkan. Hubungi administrator.',
            ], 403);
        }

        // Hapus token lama supaya tidak menumpuk
        $user->tokens()->delete();

        // Buat token baru
        $token = $user->createToken('admin-token')->plainTextToken;

        // Simpan waktu login terakhir
        $user->update(['last_login_at' => now()]);

        return response()->json([
            'message' => 'Login berhasil.',
            'token'   => $token,
            'user'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
            ],
        ]);
    }

    // Logout admin
    public function logout(Request $request): JsonResponse
    {
        // Hapus token yang sedang dipakai
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil.',
        ]);
    }

    // Ambil data admin yang sedang login
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => [
                'id'            => $request->user()->id,
                'name'          => $request->user()->name,
                'email'         => $request->user()->email,
                'role'          => $request->user()->role,
                'last_login_at' => $request->user()->last_login_at,
            ],
        ]);
    }
}