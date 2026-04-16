<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Akun Admin
        User::create([
            'name'     => 'Admin Toko Buku',
            'email'    => 'admin@tokobuku.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
            'phone'    => '081234567890',
            'address'  => 'Jl. Sudirman No. 1, Jakarta Pusat',
        ]);

        // Akun Customer contoh
        User::create([
            'name'     => 'Budi Santoso',
            'email'    => 'budi@example.com',
            'password' => Hash::make('password'),
            'role'     => 'customer',
            'phone'    => '082345678901',
            'address'  => 'Jl. Gatot Subroto No. 45, Jakarta Selatan',
        ]);

        User::create([
            'name'     => 'Siti Rahayu',
            'email'    => 'siti@example.com',
            'password' => Hash::make('password'),
            'role'     => 'customer',
            'phone'    => '083456789012',
            'address'  => 'Jl. Diponegoro No. 12, Surabaya',
        ]);
    }
}
