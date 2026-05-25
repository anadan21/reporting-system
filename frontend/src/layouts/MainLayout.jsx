import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F5F4]">
      <Header />
      
      {/* Container tengah yang menengahkan kotak form secara seimbang */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-10 flex items-center justify-center">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
