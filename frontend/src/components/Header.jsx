import React from 'react';
import { Link } from 'react-router-dom';
import logoSibima from '../assets/logo-sibima.png';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200/80 sticky top-0 z-50 shadow-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Sisi Kiri: Logo Grup SIBIMA */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={logoSibima} 
            alt="Logo SIBIMA" 
            className="h-10 w-auto object-contain transition-transform group-hover:scale-110 duration-200"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="flex flex-col gap-0">
            <span className="font-subheading tracking-tight text-black">SIBIMA</span>
            <span className="font-caption text-neutral-darkGray -mt-0.5">BERKARYA MANDIRI</span>
          </div>
        </Link>
        
        {/* Sisi Kanan: Navigation */}
        <nav className="flex items-center gap-3">
          <Link to="/track" className="text-body-small font-button text-white bg-primary hover:bg-primary-deep px-6 py-2.5 rounded-standard transition-all">
            Track Status
          </Link>
        </nav>

      </div>
    </header>
  );
}
