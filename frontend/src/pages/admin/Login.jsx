import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../api/config'; // Pastikan path ini sesuai ke file config.js Anda

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        // 1. Mencegah halaman reload otomatis agar log error tidak hilang
        e.preventDefault(); 
        
        // 2. Kunci tombol agar tidak diklik berkali-kali
        setLoading(true);

        console.log("Mencoba login dengan:", email); // Log penanda di console

        try {
            const response = await api.post('/login', {
                email: email,
                password: password
            });

            console.log("Respon dari Laravel:", response.data); // Mengecek isi balasan Laravel

            if (response.data.token) {
                // Simpan token ke localStorage
                localStorage.setItem('admin_token', response.data.token);
                localStorage.setItem('admin_user', JSON.stringify(response.data.user || { name: 'Admin IT' }));

                toast.success('Login Berhasil! Selamat Datang.');
                
                // Berpindah ke rute dashboard laporan Anda
                navigate('/admin/reports'); 
            } else {
                toast.error('Gagal mendapatkan token akses dari server.');
            }
        } catch (error) {
            console.error("Error Login:", error);
            const errMsg = error.response?.data?.message || 'Email atau password salah / koneksi terputus.';
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Panel Admin IT</h2>
                <p className="mt-2 text-center text-sm text-gray-600">Sistem Informasi Reporting Kendala</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Alamat Email</label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="admin@it.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                            >
                                {loading ? 'Memproses...' : 'Masuk Sistem'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
