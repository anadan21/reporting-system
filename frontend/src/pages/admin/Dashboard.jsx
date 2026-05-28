import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../api/config';

export default function Dashboard() {
    const [reports, setReports] = useState([]);
    const [summary, setSummary] = useState({ open: 0, in_progress: 0, done: 0 });
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/reports');
            setReports(response.data.data || []);
            setSummary(response.data.summary || { open: 0, in_progress: 0, done: 0 });
        } catch (error) {
            console.error("Gagal memuat dashboard:", error);
            toast.error("Gagal memuat data dari server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Memuat data...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard Panel Admin</h1>
                        <p className="text-sm text-gray-500 mt-1">Manajemen data laporan kendala</p>
                    </div>
                    <button onClick={() => { localStorage.clear(); window.location.href = '/admin/login'; }} className="px-6 py-2.5 bg-error text-white rounded-standard font-button hover:bg-red-700 transition-all shadow-subtle">
                        Logout
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                        <p className="text-sm font-medium text-gray-500 uppercase">Laporan Baru</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{summary.open}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
                        <p className="text-sm font-medium text-gray-500 uppercase">Diproses</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{summary.in_progress}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                        <p className="text-sm font-medium text-gray-500 uppercase">Selesai</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{summary.done}</p>
                    </div>
                </div>

                {/* Tabel Laporan */}
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-700 text-xs uppercase border-b">
                                    <th className="p-4">No Tiket</th>
                                    <th className="p-4">Pelapor</th>
                                    <th className="p-4">Unit Usaha & Lokasi</th>
                                    <th className="p-4">Judul Kendala</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-600 divide-y">
                                {reports.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-400">Belum ada data laporan.</td>
                                    </tr>
                                ) : (
                                    reports.map((report) => (
                                        <tr key={report.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/admin/reports/${report.id}`}>
                                            <td className="p-4 font-mono font-bold text-blue-600">{report.ticket}</td>
                                            <td className="p-4 font-medium text-gray-900">{report.reporter_name}</td>
                                            <td className="p-4 text-xs text-gray-700">
                                                {report.unit_business} <br />
                                                {/* 🛠️ PERBAIKAN: Ikon pin 📍 sudah dihapus dari sini */}
                                                <span className="text-gray-400">{report.unit_location}</span>
                                            </td>
                                            <td className="p-4">{report.title}</td>
                                            <td className="p-4">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 uppercase">
                                                    {report.status_label}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-400 text-xs">{report.created_at}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
