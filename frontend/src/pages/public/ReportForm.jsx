import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../api/config';
import { Link } from 'react-router-dom';

const UNIT_BUSINESSES = [
    "PT. BERKAT ONO SUKSES",
    "PT. SINAR BINTANG MULIA",
    "PT. CAHAYA MITRA PERKASA",
    "PT. CMP MOTOR SPORT",
    "PT. ONO TEKNOLOGI INDONESIA",
    "PT. ONO LOGISTIK RAYA",
    "PT. ONO KREASI GASINDO",
    "PT. WAHANA KONSTRUKSI MANDIRI",
    "PT. SIBIMA BERKARYA MANDIRI",
    "PT. ONO LOGISTIK INDONESIA",
    "CV. ONO CRAFT",
    "CV. ONO PAWON",
    "Other"
];

const LOKASI_UNITS = [
    "PAL 2",
    "PAL 7",
    "TANJUNG",
    "Other"
];

export default function ReportForm() {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [ticketId, setTicketId] = useState(null);

    const selectedUnitBusiness = watch('unit_business');
    const selectedUnitLocation = watch('unit_location');

    const onSubmit = async (data) => {
        setLoading(true);
        const formData = new FormData();

        const finalUnitBusiness = selectedUnitBusiness === 'Other' ? data.custom_unit_business : data.unit_business;
        const finalUnitLocation = selectedUnitLocation === 'Other' ? data.custom_unit_location : data.unit_location;

        formData.append('reporter_name', data.reporter_name);
        formData.append('reporter_email', data.reporter_email);
        formData.append('reporter_phone', data.reporter_phone || '');
        formData.append('unit_business', finalUnitBusiness);
        formData.append('division_name', data.division_name);
        formData.append('unit_location', finalUnitLocation);
        formData.append('title', data.title);
        formData.append('description', data.description);

        // 🛠️ PERBAIKAN SANGAT AMAN: Mengamankan pembacaan file upload agar anti macet
        if (data.attachment_path && data.attachment_path.length > 0) {
            formData.append('attachment_path', data.attachment_path[0]);
        }

        try {
            const response = await api.post('/reports', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Ambil nomor tiket kustom asli dari backend Laravel Anda
            const generatedTicket = response.data.ticket_id;
            setTicketId(generatedTicket); 
            
            toast.success('Laporan berhasil dikirim!');
            
            // Bersihkan form input dengan aman
            reset();

        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || 'Gagal mengirim laporan kendala.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">Form Pelaporan Kendala IT</h2>
                    <p className="mt-2 text-sm text-gray-500">Silakan isi detail masalah fasilitas IT Anda di bawah ini.</p>
                    
                    <div className="mt-4">
                        <Link to="/track" className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition shadow-sm border border-blue-100">
                            🔍 Sudah Punya Tiket? Lacak Status Disini →
                        </Link>
                    </div>
                </div>

                {/* 🛠️ KOTAK STRUKTUR BARU PERMANEN: Menampilkan nomor tiket kustom asli */}
                {ticketId && (
                    <div className="mb-6 p-5 bg-green-50 border-2 border-green-200 text-green-900 rounded-xl text-center shadow-sm">
                        <p className="text-sm font-semibold text-green-700">✓ Berhasil! Laporan Anda telah kami terima.</p>
                        <p className="text-xl font-black mt-2 bg-white px-4 py-2 rounded-md border inline-block shadow-sm tracking-wide font-mono text-gray-800 uppercase">
                            {ticketId}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Silakan <b>Salin / Catat</b> nomor tiket di atas untuk memantau progres perbaikan.</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Lengkap *</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2.5 border"
                            placeholder="John Doe"
                            {...register('reporter_name', { required: 'Nama lengkap wajib diisi' })}
                        />
                        {errors.reporter_name && <p className="text-red-500 text-xs mt-1">{errors.reporter_name.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email *</label>
                            <input
                                type="email"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2.5 border"
                                placeholder="john@perusahaan.com"
                                {...register('reporter_email', { required: 'Email aktif wajib diisi' })}
                            />
                            {errors.reporter_email && <p className="text-red-500 text-xs mt-1">{errors.reporter_email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nomor Telepon / WA</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2.5 border"
                                placeholder="08123456789"
                                {...register('reporter_phone')}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Unit Usaha *</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2.5 border bg-white"
                            {...register('unit_business', { required: 'Silakan pilih unit usaha Anda' })}
                        >
                            <option value="">-- Pilih Unit Usaha --</option>
                            {UNIT_BUSINESSES.map((unit) => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </select>
                        {errors.unit_business && <p className="text-red-500 text-xs mt-1">{errors.unit_business.message}</p>}

                        {selectedUnitBusiness === 'Other' && (
                            <input
                                type="text"
                                placeholder="Ketik Manual Nama Unit Usaha Anda disini..."
                                className="mt-2 block w-full rounded-md border-red-300 shadow-sm sm:text-sm p-2.5 border bg-red-50"
                                {...register('custom_unit_business', { required: 'Nama unit kustom wajib ditulis jika memilih Other' })}
                            />
                        )}
                        {errors.custom_unit_business && <p className="text-red-500 text-xs mt-1">{errors.custom_unit_business.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Divisi / Bagian *</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2.5 border"
                            placeholder="Divisi Keuangan / HC / GA"
                            {...register('division_name', { required: 'Nama divisi wajib diisi' })}
                        />
                        {errors.division_name && <p className="text-red-500 text-xs mt-1">{errors.division_name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Lokasi Unit *</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2.5 border bg-white"
                            {...register('unit_location', { required: 'Silakan pilih lokasi tempat kerja Anda' })}
                        >
                            <option value="">-- Pilih Lokasi Unit --</option>
                            {LOKASI_UNITS.map((loc) => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                        {errors.unit_location && <p className="text-red-500 text-xs mt-1">{errors.unit_location.message}</p>}

                        {selectedUnitLocation === 'Other' && (
                            <input
                                type="text"
                                placeholder="Ketik Manual Alamat / Nama Lokasi Anda disini..."
                                className="mt-2 block w-full rounded-md border-red-300 shadow-sm sm:text-sm p-2.5 border bg-red-50"
                                {...register('custom_unit_location', { required: 'Nama lokasi kustom wajib ditulis jika memilih Other' })}
                            />
                        )}
                        {errors.custom_unit_location && <p className="text-red-500 text-xs mt-1">{errors.custom_unit_location.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Judul Kendala IT *</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2.5 border"
                            placeholder="Contoh: Koneksi internet putus / PC Mati total"
                            {...register('title', { required: 'Judul masalah wajib ditulis singkat' })}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Deskripsi Detail Masalah *</label>
                        <textarea
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2.5 border"
                            placeholder="Ceritakan kronologi kendala atau pesan error yang muncul di layar monitor..."
                            {...register('description', { required: 'Mohon tulis deskripsi kendala dengan jelas' })}
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Dokumen / Bukti Foto (Optional)</label>
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border p-1 rounded-md"
                            {...register('attachment_path')}
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 font-bold transition"
                        >
                            {loading ? 'Sedang Mengirim Laporan...' : 'Kirim Laporan Kendala'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
