import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function TrackTicket() {
    const [ticketNumber, setTicketNumber] = useState('');
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!ticketNumber.trim()) return;

        setLoading(true);
        setReport(null);

        try {
            // Menembak endpoint publik pelacakan tiket di port 8000
            const response = await axios.get(`http://localhost:8000/api/reports/track/${encodeURIComponent(ticketNumber.trim())}`);
            setReport(response.data.data);
            toast.success("Data tiket berhasil ditemukan!");
        } catch (error) {
            const msg = error.response?.data?.message || 'Nomor tiket tidak ditemukan. Periksa kembali penulisan Anda.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                {/* Navigasi Kembali ke Form Utama */}
                <button onClick={() => navigate('/')} className="mb-6 text-sm font-medium text-blue-600 hover:underline flex items-center">
                    ← Kembali ke Form Pengaduan
                </button>

                {/* Kotak Input Pencarian Tiket */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Lacak Status Tiket IT</h2>
                    <p className="text-xs text-gray-500 text-center mb-6">Masukkan nomor tiket lengkap Anda untuk melihat progres perbaikan teknisi</p>

                    <form onSubmit={handleTrack} className="flex gap-2">
                        <input
                            type="text"
                            required
                            placeholder="Contoh: SIBIMA - 260525001"
                            className="flex-1 text-sm px-4 py-2.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold uppercase"
                            value={ticketNumber}
                            onChange={(e) => setTicketNumber(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading || !ticketNumber.trim()}
                            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700 disabled:bg-gray-300 transition"
                        >
                            {loading ? 'Mencari...' : 'Cari Tiket'}
                        </button>
                    </form>
                </div>

                {/* Tampilan Visual Detail Progres Tiket (Muncul jika data ditemukan) */}
                {report && (
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-6">
                        <div className="flex justify-between items-start border-b pb-4">
                            <div>
                                <span className="text-xs font-mono font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded">{report.ticket}</span>
                                <h3 className="text-xl font-bold text-gray-900 mt-2">{report.title}</h3>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 uppercase">{report.status_label}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-md">
                            <div>
                                <p className="text-gray-400 uppercase font-semibold">Pelapor</p>
                                <p className="font-medium text-gray-900 mt-0.5">{report.reporter_name}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 uppercase font-semibold">Unit & Divisi</p>
                                <p className="font-medium text-gray-900 mt-0.5">{report.unit_business} ({report.division_name})</p>
                            </div>
                        </div>

                        {/* Catatan Progres Dari Teknisi IT (Jika admin menambahkan notes) */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-3 border-b pb-1">📋 Riwayat Progres Teknis</h4>
                            <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                                {report.notes.length === 0 ? (
                                    <p className="text-xs text-gray-400 italic">Laporan Anda telah diterima sistem dan sedang mengantre untuk ditinjau oleh teknisi IT.</p>
                                ) : (
                                    report.notes.map((note) => (
                                        <div key={note.id} className="bg-blue-50/50 p-3 rounded border border-blue-100/50">
                                            <p className="text-xs text-gray-800">{note.note}</p>
                                            <p className="text-xxs text-gray-400 text-right mt-1.5">{note.created_at}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
