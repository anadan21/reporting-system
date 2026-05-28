import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingLines from '../components/FloatingLines';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0A1628 0%, #0F1E38 30%, #0D1830 65%, #111C30 100%)' }}>

      {/* Subtle radial depth — biru navy di tengah atas */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1,
        background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(30,90,200,0.25) 0%, transparent 65%), radial-gradient(ellipse 60% 40% at 15% 60%, rgba(0,60,160,0.12) 0%, transparent 55%), radial-gradient(ellipse 50% 35% at 85% 80%, rgba(80,40,180,0.1) 0%, transparent 55%)'
      }} />

      {/* FloatingLines — biru cerah di atas latar gelap, multiply = solid & visible */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0.9 }}>
        <FloatingLines 
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={[3, 6, 3]}
          lineDistance={[10, 13, 9]}
          animationSpeed={0.5}
          interactive={true}
          parallax={true}
          linesGradient={[
            "#62AEF0",
            "#1E7FE0",
            "#4AB0FF",
            "#7EC8FF",
            "#A8D8FF"
          ]}
          bendRadius={8}
          bendStrength={-0.45}
          mouseDamping={0.05}
          mixBlendMode="screen"
        />
      </div>

      {/* Header */}
      <div className="relative" style={{ zIndex: 10 }}>
        <Header />
      </div>
      
      {/* Main Content */}
      <main className="relative flex-1 w-full px-4 pb-10 flex items-start justify-center" style={{ zIndex: 10 }}>
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <div className="relative" style={{ zIndex: 10 }}>
        <Footer />
      </div>
    </div>
  );
}