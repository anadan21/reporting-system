import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../api/config';
import MainLayout from '../../layouts/MainLayout';

const STATUS_CONFIG = {
    open:        { label: 'Open',        color: '#62AEF0', bg: 'rgba(98,174,240,0.15)',  border: 'rgba(98,174,240,0.3)'  },
    in_progress: { label: 'In Progress', color: '#4AB0FF', bg: 'rgba(74,176,255,0.15)',  border: 'rgba(74,176,255,0.3)'  },
    resolved:    { label: 'Resolved',    color: '#34D399', bg: 'rgba(52,211,153,0.15)',   border: 'rgba(52,211,153,0.3)'  },
    closed:      { label: 'Closed',      color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.07)', border: 'rgba(255,255,255,0.15)' },
};

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.open;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
            color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
            letterSpacing: '0.04em', textTransform: 'uppercase'
        }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.color, display: 'inline-block' }} />
            {cfg.label}
        </span>
    );
}

/* Reusable glass card */
const glassCard = {
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    boxShadow: '0 24px 48px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.08) inset',
};

export default function TrackTicket() {
    const [ticketNumber, setTicketNumber] = useState('');
    const [report, setReport]             = useState(null);
    const [loading, setLoading]           = useState(false);
    const navigate = useNavigate();

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!ticketNumber.trim()) return;
        setLoading(true);
        setReport(null);
        try {
            const response = await api.get(`/reports/track/${encodeURIComponent(ticketNumber.trim())}`);
            setReport(response.data.data);
            toast.success('Ticket found!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Ticket not found. Please check your input.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="w-full space-y-5">

                {/* Back button */}
                <button onClick={() => navigate('/')} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.5)', fontSize: '13px', padding: '0',
                    transition: 'color 0.2s',
                }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(98,174,240,0.9)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Report Form
                </button>

                {/* Search card */}
                <div style={glassCard}>
                    {/* Top accent line */}
                    <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #62AEF0, #4AB0FF, transparent)', borderRadius: '16px 16px 0 0' }} />

                    <div style={{ padding: '32px 32px 28px' }}>
                        {/* Header */}
                        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: '48px', height: '48px', borderRadius: '12px', marginBottom: '16px',
                                background: 'rgba(98,174,240,0.12)', border: '1px solid rgba(98,174,240,0.25)',
                            }}>
                                <svg width="22" height="22" fill="none" stroke="#62AEF0" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                                </svg>
                            </div>
                            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px', letterSpacing: '-0.01em' }}>
                                Track Your Status
                            </h1>
                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
                                Enter your ticket number to check progress
                            </p>
                        </div>

                        {/* Search form */}
                        <form onSubmit={handleTrack} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                required
                                placeholder="e.g. SIBIMA-260525001"
                                value={ticketNumber}
                                onChange={(e) => setTicketNumber(e.target.value)}
                                style={{
                                    flex: '1', minWidth: '200px', padding: '12px 16px', borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                                    color: '#FFFFFF', fontSize: '14px', fontFamily: 'monospace', textTransform: 'uppercase',
                                    outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box',
                                }}
                                onFocus={e => { e.target.style.border = '1px solid rgba(98,174,240,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(98,174,240,0.12)'; e.target.style.background = 'rgba(255,255,255,0.1)'; }}
                                onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
                            />
                            <button type="submit" disabled={loading || !ticketNumber.trim()} style={{
                                padding: '12px 22px', borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                                background: (loading || !ticketNumber.trim()) ? 'rgba(98,174,240,0.25)' : 'linear-gradient(135deg, #62AEF0 0%, #0075DE 55%, #097FE8 100%)',
                                color: '#FFFFFF', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap',
                                boxShadow: loading ? 'none' : '0 4px 20px rgba(0,117,222,0.35)',
                                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px',
                            }}>
                                {loading ? (
                                    <>
                                        <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                        </svg>
                                        Search
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Result card */}
                {report && (
                    <div style={{ ...glassCard, animation: 'fadeUp 0.3s ease' }}>
                        {/* Top accent */}
                        <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #34D399, #62AEF0, transparent)', borderRadius: '16px 16px 0 0' }} />

                        {/* Ticket header */}
                        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <span style={{
                                        display: 'inline-block', padding: '4px 12px', borderRadius: '8px',
                                        background: 'rgba(98,174,240,0.12)', border: '1px solid rgba(98,174,240,0.2)',
                                        fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, color: '#62AEF0', letterSpacing: '0.08em'
                                    }}>
                                        {report.ticket}
                                    </span>
                                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', margin: 0, lineHeight: 1.4 }}>
                                        {report.title}
                                    </h2>
                                </div>
                                <StatusBadge status={report.status} />
                            </div>
                        </div>

                        {/* Reporter info grid */}
                        <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                                {[
                                    { label: 'Submitted by', value: report.reporter_name },
                                    { label: 'Email',        value: report.reporter_email || '—' },
                                    { label: 'Business Unit',value: report.unit_business },
                                    { label: 'Department',   value: report.division_name },
                                ].map(({ label, value }) => (
                                    <div key={label} style={{
                                        padding: '12px 14px', borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                                    }}>
                                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px', fontWeight: 600 }}>{label}</p>
                                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: 500, margin: 0 }}>{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Progress notes */}
                        <div style={{ padding: '20px 28px' }}>
                            <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg width="14" height="14" fill="none" stroke="#62AEF0" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"/>
                                </svg>
                                Progress Updates
                            </h3>
                            <div style={{ maxHeight: '240px', overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {!report.notes || report.notes.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '24px', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
                                            Issue received — pending review by IT support team.
                                        </p>
                                    </div>
                                ) : (
                                    report.notes.map((note) => (
                                        <div key={note.id} style={{
                                            padding: '14px 16px', borderRadius: '10px',
                                            background: 'rgba(98,174,240,0.07)', border: '1px solid rgba(98,174,240,0.15)',
                                            borderLeft: '3px solid rgba(98,174,240,0.5)',
                                        }}>
                                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, margin: 0 }}>{note.note}</p>
                                            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textAlign: 'right', marginTop: '8px', marginBottom: 0 }}>{note.created_at}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin    { to { transform: rotate(360deg); } }
                @keyframes fadeUp  { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                input::placeholder { color: rgba(255,255,255,0.2); font-family: inherit; text-transform: none; }
            `}</style>
        </MainLayout>
    );
}