<?php

namespace App\Enums;

enum ReportStatusEnum: string
{
    case Open       = 'open';
    case InProgress = 'in_progress';
    case Done       = 'done';

    // Label yang tampil di UI
    public function label(): string
    {
        return match($this) {
            self::Open       => 'Terbuka',
            self::InProgress => 'Dalam Proses',
            self::Done       => 'Selesai',
        };
    }

    // Warna badge untuk frontend
    public function color(): string
    {
        return match($this) {
            self::Open       => 'blue',
            self::InProgress => 'yellow',
            self::Done       => 'green',
        };
    }
}