<?php

namespace App\Mail;

use App\Models\Report;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewReportMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Report $report)
    {
        //
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "[IT Report] Laporan Baru #{$this->report->id} dari {$this->report->reporter_name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.reports.new-report',
            with: [
                'report'  => $this->report,
                'adminUrl' => env('FRONTEND_URL') . '/admin/reports/' . $this->report->id,
            ],
        );
    }
}