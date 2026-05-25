import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../api/config';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        console.log('Attempting login with:', { email, password });
        console.log('API Base URL:', import.meta.env.VITE_API_URL);

        try {
            const response = await api.post('/login', {
                email: email,
                password: password
            });

            console.log('Login Response:', response.data);

            if (response.data.token) {
                localStorage.setItem('admin_token', response.data.token);
                localStorage.setItem('admin_user', JSON.stringify(response.data.user || { name: 'Admin IT' }));
                toast.success('Login successful!');
                navigate('/admin/reports');
            } else {
                toast.error('Failed to get access token from server.');
            }
        } catch (error) {
            console.error('Login Error:', error);
            console.error('Error Response:', error.response);
            console.error('Error Message:', error.message);
            
            const errMsg = error.response?.data?.message || error.message || 'Invalid email or password / connection failed.';
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F6F5F4] to-[#F2F9FF] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
                <div className="text-center">
                    <h1 className="font-h3 text-black mb-2">SIBIMA Admin Panel</h1>
                    <p className="text-body-small text-neutral-darkGray">IT Infrastructure & Issue Reporting Center</p>
                </div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-8 rounded-card shadow-subtle border border-gray-200/50">
                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-caption font-bold text-black uppercase tracking-wider mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 border border-neutral-darkGray rounded-standard shadow-subtle text-body focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-all"
                                placeholder=""
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-caption font-bold text-black uppercase tracking-wider mb-2">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 border border-neutral-darkGray rounded-standard shadow-subtle text-body focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-all"
                                placeholder=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-[44px] flex justify-center items-center font-button text-white bg-primary hover:bg-primary-deep active:bg-primary-navy rounded-standard shadow-subtle transition-all disabled:bg-neutral-lightGray disabled:text-neutral-darkGray mt-6"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-caption text-neutral-darkGray text-center">Need access? Contact IT Administrator</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
