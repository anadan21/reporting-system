import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../api/config';
import logoSibima from '../../assets/logo-sibima.png';
import FloatingLines from '../../components/FloatingLines';

export default function Login() {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading]   = useState(false);
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/login', { email, password });
            if (response.data.token) {
                localStorage.setItem('admin_token', response.data.token);
                localStorage.setItem('admin_user', JSON.stringify(response.data.user || { name: 'Admin IT' }));
                toast.success('Login successful!');
                navigate('/admin/reports');
            } else {
                toast.error('Failed to get access token from server.');
            }
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message || 'Invalid email or password.';
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #0A1628 0%, #0F1E38 35%, #0D1830 65%, #111C30 100%)' }}>

            {/* Same FloatingLines as main page — konsistensi visual */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(30,90,200,0.22) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 10% 70%, rgba(0,60,160,0.1) 0%, transparent 55%)'
                }} />
            </div>

            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0.85 }}>
                <FloatingLines
                    enabledWaves={["top", "middle", "bottom"]}
                    lineCount={[3, 5, 3]}
                    lineDistance={[10, 13, 9]}
                    animationSpeed={0.5}
                    interactive={true}
                    parallax={true}
                    linesGradient={["#62AEF0","#1E7FE0","#4AB0FF","#7EC8FF","#A8D8FF"]}
                    bendRadius={8}
                    bendStrength={-0.45}
                    mouseDamping={0.05}
                    mixBlendMode="screen"
                />
            </div>

            {/* Center panel */}
            <div className="relative w-full max-w-md mx-auto px-4" style={{ zIndex: 10 }}>

                {/* Logo + brand di atas card */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative flex items-center justify-center mb-4">
                        <div className="absolute rounded-full blur-3xl" style={{
                            width: '160px', height: '160px',
                            background: 'radial-gradient(circle, rgba(220,50,50,0.2) 0%, rgba(0,80,200,0.12) 50%, transparent 75%)'
                        }} />
                        <img
                            src={logoSibima}
                            alt="Logo SIBIMA"
                            style={{
                                height: '90px', width: 'auto', objectFit: 'contain', position: 'relative',
                                filter: 'drop-shadow(0 0 16px rgba(220,50,50,0.3)) drop-shadow(0 0 8px rgba(0,80,200,0.25)) drop-shadow(0 4px 12px rgba(0,0,0,0.5))'
                            }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-px w-8" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4))' }} />
                        <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FFFFFF', textShadow: '0 0 20px rgba(100,180,255,0.5)' }}>
                            PT SIBIMA BERKAYA MANDIRI
                        </span>
                        <div className="h-px w-8" style={{ background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.4))' }} />
                    </div>

                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', marginTop: '4px' }}>
                        Admin Portal
                    </p>
                </div>

                {/* Login Card — glassmorphism gelap */}
                <div style={{
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    boxShadow: '0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 1px 0 rgba(255,255,255,0.12) inset',
                    padding: '40px 36px',
                }}>
                    {/* Card header */}
                    <div className="mb-7">
                        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px', letterSpacing: '-0.01em' }}>
                            Sign In
                        </h2>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
                            Enter your credentials to access the admin panel
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: '8px' }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="admin@sibima.id"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px 16px', borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.07)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    color: '#FFFFFF', fontSize: '14px', outline: 'none',
                                    transition: 'all 0.2s',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={e => { e.target.style.border = '1px solid rgba(98,174,240,0.7)'; e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = '0 0 0 3px rgba(98,174,240,0.15)'; }}
                                onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.07)'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: '8px' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: '100%', padding: '12px 44px 12px 16px', borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.07)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        color: '#FFFFFF', fontSize: '14px', outline: 'none',
                                        transition: 'all 0.2s',
                                        boxSizing: 'border-box',
                                    }}
                                    onFocus={e => { e.target.style.border = '1px solid rgba(98,174,240,0.7)'; e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = '0 0 0 3px rgba(98,174,240,0.15)'; }}
                                    onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.07)'; e.target.style.boxShadow = 'none'; }}
                                />
                                {/* Toggle show/hide password */}
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 0, lineHeight: 1 }}
                                    tabIndex={-1}
                                >
                                    {showPass ? (
                                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                                    ) : (
                                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%', height: '46px', borderRadius: '10px', border: 'none',
                                    background: loading ? 'rgba(98,174,240,0.3)' : 'linear-gradient(135deg, #62AEF0 0%, #0075DE 55%, #097FE8 100%)',
                                    color: '#FFFFFF', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                                    boxShadow: loading ? 'none' : '0 4px 24px rgba(0,117,222,0.4), 0 1px 0 rgba(255,255,255,0.15) inset',
                                    transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
                                        Sign In
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer note */}
                    <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                            Need access?{' '}
                            <span style={{ color: 'rgba(98,174,240,0.8)', cursor: 'pointer' }}>Contact IT Administrator</span>
                        </p>
                    </div>
                </div>

                {/* Bottom label */}
                <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
                    © {new Date().getFullYear()} PT SIBIMA BERKAYA MANDIRI
                </p>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                input::placeholder { color: rgba(255,255,255,0.2); }
                input:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0 100px rgba(15,30,56,0.95) inset !important;
                    -webkit-text-fill-color: #ffffff !important;
                }
            `}</style>
        </div>
    );
}