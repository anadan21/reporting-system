<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'is_active'      => 'boolean',
        'last_login_at'  => 'datetime',
        'password'       => 'hashed',
    ];

    // Relasi: satu admin bisa punya banyak catatan
    public function reportNotes()
    {
        return $this->hasMany(ReportNote::class, 'admin_id');
    }

    // Relasi: satu admin bisa ubah status banyak laporan
    public function statusHistories()
    {
        return $this->hasMany(ReportStatusHistory::class, 'admin_id');
    }
}