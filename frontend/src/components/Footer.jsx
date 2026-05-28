import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto" style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.97) 0%, rgba(30,41,59,0.95) 100%)', backdropFilter: 'blur(12px)' }}>
      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          
          {/* Company */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-primary to-primary-deep" />
              <h4 className="font-subheading text-white tracking-wide">SIBIMA</h4>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed pl-3">
              PT SIBIMA BERKAYA MANDIRI — Solusi IT Infrastructure dan Issue Reporting Center untuk perusahaan modern.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-primary to-primary-deep" />
              <h4 className="font-subheading text-white tracking-wide">Quick Links</h4>
            </div>
            <ul className="space-y-2 pl-3">
              {[
                { label: 'Report Issue', href: '/' },
                { label: 'Track Status', href: '/track' },
                { label: 'Admin Portal', href: '/admin/login' },
                { label: 'Contact Support', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a 
                    href={href} 
                    className="text-sm text-gray-400 hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-primary transition-all duration-300 group-hover:w-3" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-primary to-primary-deep" />
              <h4 className="font-subheading text-white tracking-wide">Support</h4>
            </div>
            <ul className="space-y-2 pl-3 text-sm text-gray-400">
              <li className="flex items-center gap-2"><span className="text-primary/70">✉</span> support@sibima.id</li>
              <li className="flex items-center gap-2"><span className="text-primary/70">☏</span> +62 853-8907-7507</li>
              <li className="flex items-center gap-2"><span className="text-primary/70">⌖</span> Batulicin, Indonesia</li>
              <li className="flex items-center gap-2"><span className="text-primary/70">◷</span> Mon–Sat: 08:00–17:00</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} PT SIBIMA BERKAYA MANDIRI. All Rights Reserved.</p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Documentation'].map((item) => (
              <a key={item} href="#" className="hover:text-primary transition-colors duration-200">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}