import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../api/config';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

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
            // Gunakan api client yang sudah punya baseURL dari environment
            const response = await api.get(`/reports/track/${encodeURIComponent(ticketNumber.trim())}`);
            setReport(response.data.data);
            toast.success("Ticket data found successfully!");
        } catch (error) {
            const msg = error.response?.data?.message || 'Ticket number not found. Please check your input again.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F6F5F4]">
            <Header />
            
            <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-10 flex items-center justify-center">
                <div className="w-full max-w-xl">
                    {/* Back Button - Proper Styled */}
                    <button 
                        onClick={() => navigate('/')} 
                        className="mb-6 px-6 py-2.5 bg-neutral-lightGray text-black font-button rounded-standard hover:bg-gray-300 transition-all"
                    >
                        ← Back
                    </button>

                    <div className="bg-white rounded-card shadow-subtle p-6 mb-6">
                        <h1 className="text-h3 text-black text-center mb-2">Track Status</h1>
                        <p className="text-body-small text-neutral-darkGray text-center mb-6">Enter your ticket number to check the progress</p>

                        <form onSubmit={handleTrack} className="flex gap-3 flex-col sm:flex-row">
                            <input
                                type="text"
                                required
                                placeholder="Example: SIBIMA-260525001"
                                className="flex-1 px-4 py-3 border border-neutral-darkGray rounded-standard text-body font-mono uppercase placeholder:normal-case placeholder:text-neutral-darkGray focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10"
                                value={ticketNumber}
                                onChange={(e) => setTicketNumber(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={loading || !ticketNumber.trim()}
                                className="px-6 py-3 bg-primary text-white font-button rounded-standard hover:bg-primary-deep transition disabled:opacity-50 whitespace-nowrap"
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </form>
                    </div>

                    {report && (
                        <div className="bg-white rounded-card shadow-subtle p-6 space-y-6">
                            <div className="flex justify-between items-start border-b border-neutral-lightGray pb-4 flex-wrap gap-3">
                                <div>
                                    <span className="inline-block px-3 py-1 rounded-pill bg-primary/10 text-primary-deep font-mono text-caption font-bold">
                                        {report.ticket}
                                    </span>
                                    <h2 className="text-h4 text-black mt-3">{report.title}</h2>
                                </div>
                                <span className="px-3 py-1.5 rounded-pill bg-neutral-lightGray text-black text-caption font-semibold uppercase">
                                    {report.status_label || report.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-caption bg-neutral-lightGray p-4 rounded-standard">
                                <div>
                                    <p className="text-neutral-darkGray uppercase font-semibold">Submitted by</p>
                                    <p className="font-medium text-black mt-1">{report.reporter_name}</p>
                                </div>
                                <div>
                                    <p className="text-neutral-darkGray uppercase font-semibold">Department</p>
                                    <p className="font-medium text-black mt-1">{report.unit_business} / {report.division_name}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-body font-bold text-black mb-3 border-b border-neutral-lightGray pb-2">📋 Progress Updates</h3>
                                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                    {report.notes?.length === 0 ? (
                                        <p className="text-caption text-neutral-darkGray italic">Your issue has been received and is pending review by the IT support team.</p>
                                    ) : (
                                        report.notes?.map((note) => (
                                            <div key={note.id} className="bg-surface-offWhite p-3 rounded-standard border border-primary/20">
                                                <p className="text-body-small text-black">{note.note}</p>
                                                <p className="text-caption text-neutral-darkGray text-right mt-2">{note.created_at}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            
            <Footer />
        </div>
    );
}