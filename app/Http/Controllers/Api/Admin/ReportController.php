<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\ReportStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AddNoteRequest;
use App\Http\Requests\Admin\UpdateStatusRequest;
use App\Http\Resources\ReportResource; // Menggunakan resource utama yang sudah diperbaiki
use App\Models\Report;
use App\Models\ReportNote;
use App\Models\ReportStatusHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    // GET /api/admin/reports — daftar laporan dengan filter & search
    public function index(Request $request): JsonResponse
    {
        $query = Report::query();

        // Filter berdasarkan status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search berdasarkan judul, nama pelapor, atau unit usaha
        if ($request->filled('search')) {
            $keyword = $request->search;
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'LIKE', "%{$keyword}%")
                  ->orWhere('reporter_name', 'LIKE', "%{$keyword}%")
                  // 🛠️ PERBAIKAN: Mengubah pencarian company_name lama menjadi unit_business & lokasi yang baru
                  ->orWhere('unit_business', 'LIKE', "%{$keyword}%")
                  ->orWhere('unit_location', 'LIKE', "%{$keyword}%")
                  ->orWhere('division_name', 'LIKE', "%{$keyword}%");
            });
        }

        // Urutkan dari yang terbaru
        $query->latest();

        // Pagination — 10 per halaman
        $reports = $query->paginate($request->get('per_page', 10));

        return response()->json([
            'data' => ReportResource::collection($reports),
            'meta' => [
                'current_page' => $reports->currentPage(),
                'last_page'    => $reports->lastPage(),
                'per_page'     => $reports->perPage(),
                'total'        => $reports->total(),
            ],
            'summary' => [
                'open'        => Report::where('status', 'open')->count(),
                'in_progress' => Report::where('status', 'in_progress')->count(),
                'done'        => Report::where('status', 'done')->count(),
            ],
        ]);
    }

    // GET /api/admin/reports/{id} — detail laporan
    public function show(Report $report): JsonResponse
    {
        // Load relasi catatan dan riwayat
        $report->load([
            'notes.admin',
            'statusHistories.admin',
        ]);

        return response()->json([
            // 🛠️ PERBAIKAN UTAMA: Mengubah ReportDetailResource menjadi ReportResource agar data unit usaha & lokasi terbaca
            'data' => new ReportResource($report),
        ]);
    }

    // PATCH /api/admin/reports/{id}/status — ubah status laporan
    public function updateStatus(UpdateStatusRequest $request, Report $report): JsonResponse
    {
        $oldStatus = $report->status->value;
        $newStatus = $request->status;

        // Kalau status sama, tidak perlu diubah
        if ($oldStatus === $newStatus) {
            return response()->json([
                'message' => 'Status tidak berubah.',
            ], 422);
        }

        // Update status laporan
        $report->update(['status' => $newStatus]);

        // Catat riwayat perubahan status
        ReportStatusHistory::create([
            'report_id'  => $report->id,
            'admin_id'   => $request->user()->id,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
        ]);

        return response()->json([
            'message'    => 'Status laporan berhasil diubah.',
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
        ]);
    }

    // POST /api/admin/reports/{id}/notes — tambah catatan
    public function addNote(AddNoteRequest $request, Report $report): JsonResponse
    {
        $note = ReportNote::create([
            'report_id' => $report->id,
            'admin_id'  => $request->user()->id,
            'note'      => $request->note,
        ]);

        // Load relasi admin untuk response
        $note->load('admin');

        return response()->json([
            'message' => 'Catatan berhasil ditambahkan.',
            'data'    => [
                'id'         => $note->id,
                'note'       => $note->note,
                'admin_name' => $note->admin->name,
                'created_at' => $note->created_at ? $note->created_at->format('d M Y, H:i') : now()->format('d M Y, H:i'),
            ],
        ], 201);
    }

    // DELETE /api/admin/reports/{id} — hapus laporan
    public function destroy(Report $report): JsonResponse
    {
        // Hapus file attachment jika ada
        if ($report->attachment_path) {
            \Storage::disk('public')->delete($report->attachment_path);
        }

        $report->delete();

        return response()->json([
            'message' => 'Laporan berhasil dihapus.',
        ]);
    }
}
