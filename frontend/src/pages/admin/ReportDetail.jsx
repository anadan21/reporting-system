import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../api/config';

export default function ReportDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(true);
    const [submittingNote, setSubmittingNote] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchDetailData = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/reports/${id}`);
            setReport(response.data.data);
            setNotes(response.data.data.notes || []);
        } catch (error) {
            console.error("Gagal memuat detail:", error);
            toast.error("Laporan tidak ditemukan.");
            navigate('/admin/reports');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchDetailData();
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        try {
            setUpdatingStatus(true);
            await api.patch(`/admin/reports/${id}/status`, { status: newStatus });
            toast.success(`Status diubah ke: ${newStatus}`);
            fetchDetailData();
        } catch (error) {
            toast.error("Gagal memperbarui status.");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        try {
            setSubmittingNote(true);
            await api.post(`/admin/reports/${id}/notes`, { note: newNote });
            toast.success("Catatan ditambahkan.");
            setNewNote('');
            fetchDetailData();
        } catch (error) {
            toast.error("Gagal menambahkan catatan.");
        } finally {
            setSubmittingNote(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Memuat data...</div>;
    if (!report) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate('/admin/reports')} className="mb-6 text-sm font-medium text-blue-600 hover:underline">
                    ← Kembali ke Dashboard
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="flex justify-between items-start border-b pb-4 mb-4">
                                <div>
                                    <span className="text-xs font-mono font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded">{report.ticket}</span>
                                    <h1 className="text-2xl font-bold text-gray-900 mt-2">{report.title}</h1>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 uppercase">{report.status_label}</span>
                            </div>

                            {/* 🛠️ KOREKSI OK: Tampilan 3 informasi tanpa ikon pin 📍 */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-6 bg-gray-50 p-4 rounded">
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-semibold">Nama Pelapor</p>
                                    <p className="font-medium text-gray-900 mt-0.5">{report.reporter_name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-semibold">Unit & Divisi</p>
                                    <p className="font-medium text-gray-900 mt-0.5">{report.unit_business} ({report.division_name})</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-semibold">Lokasi Unit</p>
                                    {/* Ikon pin 📍 sudah sukses dihapus total dari bawah ini */}
                                    <p className="font-medium text-gray-900 mt-0.5">{report.unit_location}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-400 text-xs uppercase font-semibold mb-2">Deskripsi Masalah</p>
                                <p className="text-gray-700 leading-relaxed bg-white p-3 border rounded">{report.description}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Catatan Riwayat Penanganan</h3>
                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                                {notes.length === 0 ? (
                                    <p className="text-sm text-gray-400 italic text-center py-4">Belum ada catatan.</p>
                                ) : (
                                    notes.map((note) => (
                                        <div key={note.id} className="bg-gray-50 p-3 rounded border">
                                            <p className="text-sm text-gray-800">{note.note}</p>
                                            <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                                                <span>Oleh: {note.admin_name}</span>
                                                <span>{note.created_at}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <form onSubmit={handleAddNote} className="flex gap-2">
                                <input 
                                    type="text"
                                    placeholder="Tulis progres perbaikan..."
                                    className="flex-1 text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    disabled={submittingNote}
                                />
                                <button type="submit" disabled={submittingNote || !newNote.trim()} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-300">
                                    Simpan
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border h-fit space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Aksi Penanganan</h3>
                        <div className="flex flex-col gap-2 pt-2">
                            <button onClick={() => handleStatusChange('open')} disabled={updatingStatus || report.status === 'open'} className="w-full py-2 px-3 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md disabled:opacity-50">
                                Set Terbuka (Open)
                            </button>
                            <button onClick={() => handleStatusChange('in_progress')} disabled={updatingStatus || report.status === 'in_progress'} className="w-full py-2 px-3 text-sm font-semibold text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded-md disabled:opacity-50">
                                Proses Kendala (In Progress)
                            </button>
                            <button onClick={() => handleStatusChange('done')} disabled={updatingStatus || report.status === 'done'} className="w-full py-2 px-3 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-md disabled:opacity-50">
                                Tandai Selesai (Done)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
