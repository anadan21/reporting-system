<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportNote extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'report_id',
        'admin_id',
        'note',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    // Relasi: catatan ini milik laporan mana
    public function report()
    {
        return $this->belongsTo(Report::class);
    }

    // Relasi: catatan ini dibuat oleh admin mana
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}