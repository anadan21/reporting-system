<?php

namespace App\Models;

use App\Enums\ReportStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'reporter_name',
        'reporter_email',
        'reporter_phone',
        'unit_business',
        'division_name',
        'unit_location',
        'title',
        'description',
        'attachment_path',
        'status',
    ];

    protected $casts = [
        'status' => ReportStatusEnum::class,
    ];

    // Relasi: satu laporan punya banyak catatan admin
    public function notes()
    {
        return $this->hasMany(ReportNote::class)->latest();
    }

    // Relasi: satu laporan punya riwayat perubahan status
    public function statusHistories()
    {
        return $this->hasMany(ReportStatusHistory::class)->latest();
    }

    // Relasi: satu laporan punya log email
    public function emailLogs()
    {
        return $this->hasMany(EmailLog::class);
    }

    // Helper: cek apakah status masih open
    public function isOpen(): bool
    {
        return $this->status === ReportStatusEnum::Open;
    }
}