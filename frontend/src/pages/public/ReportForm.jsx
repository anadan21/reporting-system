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

const LOKASI_UNITS = [
    "PAL 2",
    "PAL 7",
    "TANJUNG",
    "Other"
];

export default function ReportForm() {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [ticketId, setTicketId] = useState(() => {
        return sessionStorage.getItem('last_generated_ticket') || null;
    });

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
            const response = await api.post('/reports', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const serverTicket = response.data.ticket_id;
            
            if (serverTicket) {
                sessionStorage.setItem('last_generated_ticket', serverTicket);
                setTicketId(serverTicket);
                toast.success('Laporan berhasil dikirim!');
                
                reset({
                    reporter_name: '', reporter_email: '', reporter_phone: '',
                    unit_business: '', division_name: '', unit_location: '',
                    title: '', description: '', attachment_path: ''
                });
            } else {
                toast.error('Gagal mendapatkan nomor tiket.');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Gagal mengirim laporan kendala.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl bg-white p-6 sm:p-10 rounded-card border border-gray-200 shadow-subtle">
            {/* Success Ticket Box (Notion Semantic Style) */}
            {ticketId && (
                <div className="mb-6 p-5 bg-[#EDF7ED] border border-[#C5E1A5] text-[#1E4620] rounded-standard text-center shadow-subtle">
                    <p className="text-body-small font-bold">✓ Report Successfully Received</p>
                    <p className="text-h5 font-mono font-bold mt-3 bg-white px-4 py-2 rounded-standard border border-gray-200 inline-block text-gray-800 uppercase tracking-wide">
                        {ticketId}
                    </p>
                    <p className="text-caption text-gray-600 mt-2 leading-relaxed">
                        Please <b>save or note</b> this ticket number to track your issue progress.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label className="block text-caption font-bold text-black uppercase tracking-wider mb-2">Full Name *</label>
                    <input
                        type="text"
                        className="w-full rounded-standard border border-neutral-darkGray shadow-subtle p-3 transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-body outline-none"
                        placeholder=""
                        {...register('reporter_name', { required: 'Full name is required' })}
                    />
                    {errors.reporter_name && <p className="text-error text-caption mt-1.5">⚠️ {errors.reporter_name.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-caption font-bold text-black uppercase tracking-wider mb-2">Email Address *</label>
                        <input
                            type="email"
                            className="w-full rounded-standard border border-neutral-darkGray shadow-subtle p-3 transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-body outline-none"
                            placeholder=""
                            {...register('reporter_email', { required: 'Email address is required' })}
                        />
                        {errors.reporter_email && <p className="text-error text-caption mt-1.5">⚠️ {errors.reporter_email.message}</p>}
                    </div>
                    <div>
                        <label className="block text-caption font-bold text-black uppercase tracking-wider mb-2">WhatsApp Number</label>
                        <input
                            type="text"
                            className="w-full rounded-standard border border-neutral-darkGray shadow-subtle p-3 transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-body outline-none"
                            placeholder=""
                            {...register('reporter_phone')}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-caption font-bold text-black uppercase tracking-wider mb-2">Business Unit *</label>
                    <select
                        className="w-full rounded-standard border border-neutral-darkGray shadow-subtle p-3 bg-white transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-body outline-none cursor-pointer"
                        {...register('unit_business', { required: 'Please select your business unit' })}
                    >
                        <option value="">-- Select Business Unit --</option>
                        {UNIT_BUSINESSES.map((unit) => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                    {errors.unit_business && <p className="text-error text-caption mt-1.5">⚠️ {errors.unit_business.message}</p>}

                    {selectedUnitBusiness === 'Other' && (
                        <input
                            type="text"
                            placeholder="Enter your business unit name..."
                            className="mt-2.5 w-full rounded-standard border border-warning bg-[#FFF5ED]/40 p-3 text-body outline-none focus:border-warning focus:ring-[3px] focus:ring-warning/10"
                            {...register('custom_unit_business', { required: selectedUnitBusiness === 'Other' })}
                        />
                    )}
                </div>

                <div>
                    <label className="block text-caption font-bold text-black uppercase tracking-wider mb-2">Department *</label>
                    <input
                        type="text"
                        className="w-full rounded-standard border border-neutral-darkGray shadow-subtle p-3 transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-body outline-none"
                        placeholder=""
                        {...register('division_name', { required: 'Department name is required' })}
                    />
                    {errors.division_name && <p className="text-error text-caption mt-1.5">⚠️ {errors.division_name.message}</p>}
                </div>

                <div>
                    <label className="block text-caption font-bold text-black uppercase tracking-wider mb-2">Unit Location *</label>
                    <select
                        className="w-full rounded-standard border border-neutral-darkGray shadow-subtle p-3 bg-white transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-body outline-none cursor-pointer"
                        {...register('unit_location', { required: 'Please select your unit location' })}
                    >
                        <option value="">-- Select Unit Location --</option>
                        {LOKASI_UNITS.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                    {errors.unit_location && <p className="text-error text-caption mt-1.5">⚠️ {errors.unit_location.message}</p>}

                    {selectedUnitLocation === 'Other' && (
                        <input
                            type="text"
                            placeholder="Enter your location name..."
                            className="mt-2.5 w-full rounded-standard border border-warning bg-[#FFF5ED]/40 p-3 text-body outline-none focus:border-warning focus:ring-[3px] focus:ring-warning/10"
                            {...register('custom_unit_location', { required: selectedUnitLocation === 'Other' })}
                        />
                    )}
                </div>

                <div>
                    <label className="block text-caption font-bold text-black uppercase tracking-wider mb-2">Issue Title *</label>
                    <input
                        type="text"
                        className="w-full rounded-standard border border-neutral-darkGray shadow-subtle p-3 transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-body outline-none"
                        placeholder=""
                        {...register('title', { required: 'Issue title is required' })}
                    />
                    {errors.title && <p className="text-error text-caption mt-1.5">⚠️ {errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-caption font-bold text-black uppercase tracking-wider mb-2">Detailed Description *</label>
                    <textarea
                        rows={4}
                        className="w-full rounded-standard border border-neutral-darkGray shadow-subtle p-3 transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-body outline-none resize-none"
                        placeholder=""
                        {...register('description', { required: 'Please describe the issue in detail' })}
                    />
                    {errors.description && <p className="text-error text-caption mt-1.5">⚠️ {errors.description.message}</p>}
                </div>

                <div>
                    <label className="block text-caption font-bold text-black uppercase tracking-wider mb-2">Supporting Documentation (Optional)</label>
                    <input
                        type="file"
                        accept="image/*,.pdf"
                        className="w-full text-body text-neutral-darkGray file:mr-4 file:py-2 file:px-4 file:rounded-standard file:border-0 file:text-caption file:font-semibold file:bg-neutral-lightGray file:text-black hover:file:bg-gray-300 cursor-pointer border border-neutral-darkGray p-2 rounded-standard"
                        {...register('attachment_path')}
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-[44px] flex justify-center items-center font-button text-white bg-primary hover:bg-primary-deep active:bg-primary-navy rounded-standard shadow-subtle transition-all disabled:bg-neutral-lightGray disabled:text-neutral-darkGray"
                    >
                        {loading ? 'Sending Report...' : 'Submit Issue'}
                    </button>
                </div>
            </form>
        </div>
    );
}
