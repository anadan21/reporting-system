<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'      => 'Admin IT',
            'email'     => 'admin@it.com',
            'password'  => bcrypt('password123'), // Mengamankan password
            'role'      => 'admin',
            'is_active' => true,
        ]);
    }
}
