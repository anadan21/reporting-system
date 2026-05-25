<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailLog extends Model
{
    protected $fillable = [
        'report_id',
        'recipient_email',
        'subject',
        'body',
        'sent_at',
        'status',
        'error_message',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
    ];

    // Relasi: log ini terkait laporan mana (nullable)
    public function report()
    {
        return $this->belongsTo(Report::class);
    }
}