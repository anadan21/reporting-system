import React from 'react';
import { Link } from 'react-router-dom';
import logoSibima from '../assets/logo-sibima.png';

export default function Header() {
  return (
    <header className="w-full pt-10 pb-5 px-4 text-center" style={{ background: 'transparent' }}>
      <div className="max-w-7xl mx-auto">
        
        <Link to="/" className="group inline-block">
          <div className="flex flex-col items-center gap-3">

            {/* Logo — besar dengan glow merah/biru sesuai warna logo */}
            <div className="relative flex items-center justify-center">
              <div className="absolute rounded-full blur-3xl" style={{
                width: '180px', height: '180px',
                background: 'radial-gradient(circle, rgba(220,50,50,0.22) 0%, rgba(0,80,200,0.14) 50%, transparent 75%)'
              }} />
              <img 
                src={logoSibima} 
                alt="Logo SIBIMA" 
                className="relative w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                style={{
                  height: '130px',
                  filter: 'drop-shadow(0 0 18px rgba(220,50,50,0.35)) drop-shadow(0 0 8px rgba(0,80,200,0.3)) drop-shadow(0 4px 12px rgba(0,0,0,0.5))'
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

            {/* PT SIBIMA BERKAYA MANDIRI — putih besar korporat */}
            <div className="flex items-center gap-4 mt-1">
              <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.5))' }} />
              <span style={{
                fontSize: '15px',
                fontWeight: 800,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                textShadow: '0 0 30px rgba(100,180,255,0.6), 0 2px 8px rgba(0,0,0,0.5)',
              }}>
                PT SIBIMA BERKAYA MANDIRI
              </span>
              <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.5))' }} />
            </div>

            {/* Subtitle putih */}
            <p style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.72)',
              letterSpacing: '0.06em',
              marginTop: '0px',
              textShadow: '0 1px 6px rgba(0,0,0,0.4)'
            }}>
              IT Infrastructure &amp; Issue Reporting Center
            </p>
          </div>
        </Link>

        {/* Separator putih */}
        <div className="mt-6 flex justify-center items-center gap-3">
          <div className="h-px w-16 rounded-full" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4))' }} />
          <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.5)' }} />
          <div className="h-px w-16 rounded-full" style={{ background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.4))' }} />
        </div>
      </div>
    </header>
  );
}