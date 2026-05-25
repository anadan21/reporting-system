<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportStatusHistory extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'report_id',
        'admin_id',
        'old_status',
        'new_status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    // Relasi: riwayat ini milik laporan mana
    public function report()
    {
        return $this->belongsTo(Report::class);
    }

    // Relasi: siapa admin yang mengubah status
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}