import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../api/config';

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

const LOKASI_UNITS = ["PAL 2", "PAL 7", "TANJUNG", "Other"];

/* ─── Reusable premium input wrapper ─── */
function Field({ label, required, error, hint, children }) {
    return (
        <div className="group/field space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-widest select-none">
                <span>{label}</span>
                {required && <span className="text-error text-base leading-none">*</span>}
            </label>
            {children}
            {hint && !error && <p className="text-xs text-gray-400 pl-1">{hint}</p>}
            {error && (
                <p className="text-error text-xs flex items-center gap-1 pl-1 animate-[fadeIn_.2s_ease]">
                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}

const inputCls = "w-full px-4 py-3 rounded-lg border bg-white/60 backdrop-blur-sm text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white border-gray-200/80 shadow-sm";
const selectCls = inputCls + " cursor-pointer";

export default function ReportForm() {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [ticketId, setTicketId] = useState(() => sessionStorage.getItem('last_generated_ticket') || null);
    const [step, setStep] = useState(1);

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
        if (data.attachment_path && data.attachment_path.length > 0) {
            formData.append('attachment_path', data.attachment_path[0]);
        }

        try {
            const response = await api.post('/reports', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            const serverTicket = response.data.ticket_id;
            if (serverTicket) {
                sessionStorage.setItem('last_generated_ticket', serverTicket);
                setTicketId(serverTicket);
                setStep(1);
                toast.success('Laporan berhasil dikirim!');
                reset({ reporter_name: '', reporter_email: '', reporter_phone: '', unit_business: '', division_name: '', unit_location: '', title: '', description: '', attachment_path: '' });
            } else {
                toast.error('Gagal mendapatkan nomor tiket.');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal mengirim laporan kendala.');
        } finally {
            setLoading(false);
        }
    };

    const steps = ['Reporter Info', 'Unit & Location', 'Issue Detail'];

    return (
        <div className="w-full space-y-5">

            {/* ── Ticket Success Card ── */}
            {ticketId && (
                <div className="relative overflow-hidden rounded-2xl border border-emerald-200/60 shadow-lg" style={{ background: 'linear-gradient(135deg, rgba(236,253,245,0.95) 0%, rgba(209,250,229,0.7) 100%)', backdropFilter: 'blur(16px)' }}>
                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-emerald-300/20 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="relative p-6 text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-300 mx-auto">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-emerald-900 text-base">Report Successfully Received</p>
                            <p className="text-emerald-700 text-sm mt-1">Save your ticket number below</p>
                        </div>
                        <div className="inline-block px-6 py-3 rounded-xl bg-white border-2 border-emerald-300 shadow-sm">
                            <p className="font-mono font-bold text-primary-deep text-lg tracking-widest">{ticketId}</p>
                        </div>
                        <p className="text-xs text-emerald-600">Use this ticket number to track your issue progress in the Track Status page</p>
                    </div>
                </div>
            )}

            {/* ── Main Form Card ── */}
            <div className="relative overflow-hidden rounded-2xl border border-white/50 shadow-2xl" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)' }}>
                
                {/* Decorative corner glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 via-purple/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal/8 to-transparent rounded-full blur-2xl pointer-events-none" />

                {/* Form header */}
                <div className="relative px-8 pt-8 pb-6 border-b border-gray-100/80">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="font-h4 text-gray-900 leading-tight">Report Issue</h2>
                            <p className="text-sm text-gray-500 mt-1">Provide details about your technical problem</p>
                        </div>
                        {/* Step indicator */}
                        <div className="flex items-center gap-1.5 flex-shrink-0 mt-1">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className="transition-all duration-300"
                                    style={{
                                        width: step === i + 1 ? '24px' : '8px',
                                        height: '8px',
                                        borderRadius: '4px',
                                        background: step === i + 1
                                            ? 'linear-gradient(90deg, #62AEF0, #0075DE)'
                                            : step > i + 1 ? '#62AEF0' : '#E5E7EB'
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Step labels */}
                    <div className="flex gap-2 mt-4">
                        {steps.map((label, i) => (
                            <span
                                key={i}
                                className="text-xs px-2.5 py-1 rounded-full transition-all duration-200"
                                style={{
                                    background: step === i + 1 ? 'linear-gradient(135deg, #EBF5FE, #DBEAFE)' : 'transparent',
                                    color: step === i + 1 ? '#0075DE' : step > i + 1 ? '#62AEF0' : '#9CA3AF',
                                    fontWeight: step === i + 1 ? 600 : 400,
                                    border: step === i + 1 ? '1px solid #BFDBFE' : '1px solid transparent'
                                }}
                            >
                                {i + 1}. {label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Form body */}
                <form onSubmit={handleSubmit(onSubmit)} className="relative px-8 py-7 space-y-5">

                    {/* ═══ STEP 1: Reporter Info ═══ */}
                    {step === 1 && (
                        <div className="space-y-5 animate-[fadeIn_.25s_ease]">
                            <Field label="Full Name" required error={errors.reporter_name?.message}>
                                <input type="text" placeholder="Enter your full name" className={inputCls}
                                    {...register('reporter_name', { required: 'Full name is required' })} />
                            </Field>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Email Address" required error={errors.reporter_email?.message}>
                                    <input type="email" placeholder="your@email.com" className={inputCls}
                                        {...register('reporter_email', { required: 'Email is required' })} />
                                </Field>
                                <Field label="WhatsApp Number" hint="Optional">
                                    <input type="text" placeholder="+628xxxxxxxx" className={inputCls}
                                        {...register('reporter_phone')} />
                                </Field>
                            </div>

                            <div className="pt-2">
                                <button type="button" onClick={() => setStep(2)}
                                    className="w-full h-11 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-md"
                                    style={{ background: 'linear-gradient(135deg, #62AEF0 0%, #0075DE 60%, #097FE8 100%)' }}>
                                    Continue →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ═══ STEP 2: Unit & Location ═══ */}
                    {step === 2 && (
                        <div className="space-y-5 animate-[fadeIn_.25s_ease]">
                            <Field label="Business Unit" required error={errors.unit_business?.message}>
                                <select className={selectCls}
                                    {...register('unit_business', { required: 'Please select your business unit' })}>
                                    <option value="">— Select Business Unit —</option>
                                    {UNIT_BUSINESSES.map((u) => <option key={u} value={u}>{u}</option>)}
                                </select>
                                {selectedUnitBusiness === 'Other' && (
                                    <input type="text" placeholder="Enter business unit name..." className={inputCls + " mt-2 border-warning/60 focus:border-warning focus:ring-warning/20"}
                                        {...register('custom_unit_business', { required: selectedUnitBusiness === 'Other' })} />
                                )}
                            </Field>

                            <Field label="Department" required error={errors.division_name?.message}>
                                <input type="text" placeholder="Marketing, Finance, HR, etc." className={inputCls}
                                    {...register('division_name', { required: 'Department name is required' })} />
                            </Field>

                            <Field label="Unit Location" required error={errors.unit_location?.message}>
                                <select className={selectCls}
                                    {...register('unit_location', { required: 'Please select your unit location' })}>
                                    <option value="">— Select Unit Location —</option>
                                    {LOKASI_UNITS.map((l) => <option key={l} value={l}>{l}</option>)}
                                </select>
                                {selectedUnitLocation === 'Other' && (
                                    <input type="text" placeholder="Enter location name..." className={inputCls + " mt-2 border-warning/60 focus:border-warning focus:ring-warning/20"}
                                        {...register('custom_unit_location', { required: selectedUnitLocation === 'Other' })} />
                                )}
                            </Field>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setStep(1)}
                                    className="flex-1 h-11 rounded-xl font-semibold text-gray-600 text-sm bg-gray-100 hover:bg-gray-200 transition-all duration-200 active:scale-[0.98]">
                                    ← Back
                                </button>
                                <button type="button" onClick={() => setStep(3)}
                                    className="flex-[2] h-11 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-md"
                                    style={{ background: 'linear-gradient(135deg, #62AEF0 0%, #0075DE 60%, #097FE8 100%)' }}>
                                    Continue →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ═══ STEP 3: Issue Detail ═══ */}
                    {step === 3 && (
                        <div className="space-y-5 animate-[fadeIn_.25s_ease]">
                            <Field label="Issue Title" required error={errors.title?.message}>
                                <input type="text" placeholder="Briefly describe the issue" className={inputCls}
                                    {...register('title', { required: 'Issue title is required' })} />
                            </Field>

                            <Field label="Detailed Description" required error={errors.description?.message}>
                                <textarea rows={5} placeholder="What happened? When did it start? How to reproduce? What were you trying to do?" className={inputCls + " resize-none"}
                                    {...register('description', { required: 'Please describe the issue in detail' })} />
                            </Field>

                            <Field label="Supporting Documentation" hint="Images or PDF, max 5MB (optional)">
                                <div className="relative">
                                    <input type="file" accept="image/*,.pdf"
                                        className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gradient-to-r file:from-primary/10 file:to-primary-deep/10 file:text-primary-deep file:cursor-pointer hover:file:from-primary/20 cursor-pointer border border-dashed border-gray-200 hover:border-primary/40 p-3 rounded-lg bg-white/40 transition-all duration-200"
                                        {...register('attachment_path')} />
                                </div>
                            </Field>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setStep(2)}
                                    className="flex-1 h-11 rounded-xl font-semibold text-gray-600 text-sm bg-gray-100 hover:bg-gray-200 transition-all duration-200 active:scale-[0.98]">
                                    ← Back
                                </button>
                                <button type="submit" disabled={loading}
                                    className="flex-[2] h-11 relative overflow-hidden rounded-xl font-semibold text-white text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-md group/btn"
                                    style={{ background: 'linear-gradient(135deg, #62AEF0 0%, #0075DE 60%, #097FE8 100%)' }}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-600 pointer-events-none" />
                                    <span className="relative flex items-center justify-center gap-2">
                                        {loading ? (
                                            <>
                                                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                                Submit Report
                                            </>
                                        )}
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>

            {/* Info note */}
            <div className="rounded-xl border border-blue-100 px-5 py-4 flex gap-3 items-start" style={{ background: 'rgba(239,246,255,0.8)', backdropFilter: 'blur(8px)' }}>
                <svg className="w-4 h-4 text-primary-deep flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <p className="text-xs text-blue-700 leading-relaxed">
                    Your issue will be reviewed by the IT support team. You'll receive updates via email. Average response time: 1–2 business days.
                </p>
            </div>
        </div>
    );
}