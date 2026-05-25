<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreReportRequest;
use App\Mail\NewReportMail;
use App\Models\EmailLog;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
    /**
     * POST /api/reports
     * Menyimpan laporan kendala baru dari user publik dengan format tiket SIBIMA kustom
     */
    public function store(StoreReportRequest $request): JsonResponse
    {
        // 1. Simpan file attachment jika ada
        $attachmentPath = null;
        if ($request->hasFile('attachment_path')) {
            $attachmentPath = $request->file('attachment_path')
                ->store('attachments', 'public');
        }

        // 🛠️ LOGIKA NOMOR TIKET OTOMATIS (Contoh: SIBIMA - 260525001)
        $unitCode = 'SIBIMA'; 

        // Mengambil tanggal hari ini format YYMMDD
        $todayDate = now()->format('ymd');

        // Hitung urutan antrean laporan khusus yang masuk HARI INI
        $todayReportsCount = Report::whereDate('created_at', now()->toDateString())->count();
        $nextQueue = str_pad($todayReportsCount + 1, 3, '0', STR_PAD_LEFT); 

        // Gabungkan menjadi format penomoran tiket kustom final
        $customTicketNumber = "{$unitCode} - {$todayDate}{$nextQueue}";

        // 2. Membuat objek kosong dan memasukkan data secara manual ke kolom database (Paksa Simpan)
        $report = new Report();
        $report->ticket          = $customTicketNumber; 
        $report->reporter_name   = $request->reporter_name;
        $report->reporter_email  = $request->reporter_email;
        $report->reporter_phone  = $request->reporter_phone;
        $report->unit_business   = $request->unit_business; 
        $report->division_name   = $request->division_name;
        $report->unit_location   = $request->unit_location; 
        $report->title           = $request->title;
        $report->description     = $request->description;
        $report->attachment_path = $attachmentPath;
        $report->status          = 'open';
        $report->save();

        // 3. Amankan pengiriman email agar jika mailer local error, server TIDAK crash 500!
        try {
            $this->sendNotificationEmail($report);
        } catch (\Exception $e) {
            \Log::warning("Gagal mengirim simulasi email: " . $e->getMessage());
        }

        // 4. KUNCI UTAMA: Mengembalikan string tiket kustom langsung ke React
        return response()->json([
            'message'   => 'Laporan berhasil dikirim.',
            'ticket_id' => $customTicketNumber,
        ], 201);
    }

    /**
     * GET /api/reports/track/{ticket}
     * 🛠️ TAMBAHAN BARU: Melacak status laporan secara publik berdasarkan nomor tiket kustom SIBIMA
     */
    public function track($ticket): JsonResponse
    {
        // Mencari data laporan berdasarkan kolom teks kustom 'ticket' lengkap beserta catatan teknisi
        $report = Report::with(['notes' => function ($query) {
            $query->latest(); // Urutkan catatan dari yang paling baru
        }])->where('ticket', $ticket)->first();

        // Jika nomor tiket SIBIMA tersebut tidak ditemukan di database MySQL
        if (!$report) {
            return response()->json([
                'message' => 'Nomor tiket tidak terdaftar atau salah ketik.'
            ], 404);
        }

        // Mengembalikan struktur data rapi untuk dipetakan langsung oleh TrackTicket.jsx di React
        return response()->json([
            'success' => true,
            'data'    => [
                'id'            => $report->id,
                'ticket'        => $report->ticket,
                'reporter_name' => $report->reporter_name,
                'unit_business' => $report->unit_business,
                'division_name' => $report->division_name,
                'title'         => $report->title,
                'status_label'  => $report->status_label ?? 'Terbuka',
                'status_color'  => $report->status_color ?? 'blue',
                'notes'         => $report->notes->map(function ($note) {
                    return [
                        'id'         => $note->id,
                        'note'       => $note->note,
                        'created_at' => $note->created_at->format('d M Y, H:i'),
                    ];
                }),
            ]
        ]);
    }

    /**
     * Logika internal untuk mengirim notifikasi email bukti laporan
     */
    private function sendNotificationEmail(Report $report): void
    {
        $recipientEmail = env('TECHNICAL_TEAM_EMAIL', 'tim_it@perusahaan.com');
        $subject        = "[IT Report] Laporan Baru {$report->ticket} dari {$report->reporter_name}";
        $userEmail      = $report->reporter_email;
        $subjectUser    = "Konfirmasi Laporan IT Kendala - Tiket: {$report->ticket}";

        try {
            Mail::to($recipientEmail)->send(new NewReportMail($report));
            Mail::to($userEmail)->send(new \App\Mail\NewReportMail($report));

            EmailLog::create([
                'report_id'       => $report->id,
                'recipient_email' => $recipientEmail,
                'subject'         => $subject,
                'body'            => "Nomor tiket {$report->ticket} berhasil dikirim.",
                'sent_at'         => now(),
                'status'          => 'sent',
            ]);

        } catch (\Exception $e) {
            EmailLog::create([
                'report_id'       => $report->id,
                'recipient_email' => $recipientEmail,
                'subject'         => $subject,
                'body'            => "Laporan {$report->ticket} gagal dikirim.",
                'sent_at'         => now(),
                'status'          => 'failed',
                'error_message'   => $e->getMessage(),
            ]);
        }
    }
}
