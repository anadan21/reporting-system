import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#F6F5F4] border-t border-gray-200/60 py-6 mt-auto">
      <div className="max-w-4xl mx-auto px-4 text-center text-xs font-medium text-gray-400">
        <p>© {new Date().getFullYear()} PT. SIBIMA BERKARYA MANDIRI. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
