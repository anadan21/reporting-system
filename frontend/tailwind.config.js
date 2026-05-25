/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Membaca seluruh file komponen di dalam folder src
  ],
  theme: {
    extend: {
      colors: {
        primary: '#62AEF0',
        'primary-deep': '#0075DE',
        'primary-navy': '#097FE8',
        'neutral-black': '#000000',
        'neutral-darkGray': '#78736F',
        'neutral-lightGray': '#F6F5F4',
        'neutral-white': '#FFFFFF',
        'surface-cream': '#F6F5F4',
        'surface-offWhite': '#F2F9FF',
        'surface-warmCream': '#FCF8F5',
        'surface-lightPeach': '#FFF5ED',
        'surface-palePink': '#FEF3F1',
        error: '#F64932',
        warning: '#FFB110',
        purple: '#9849E8',
        teal: '#27918D',
        orange: '#FF6D00',
        brown: '#9C7054',
      },
      borderRadius: {
        standard: '8px',
        card: '12px',
        pill: '1000px',
      },
      boxShadow: {
        subtle: '0px 0.667px 3.502px 0px rgba(0,0,0,0.01), 0px 2.933px 7.252px 0px rgba(0,0,0,0.016), 0px 7.2px 14.462px 0px rgba(0,0,0,0.02), 0px 13.867px 28.348px 0px rgba(0,0,0,0.024), 0px 23.333px 52.123px 0px rgba(0,0,0,0.03), 0px 36px 89px 0px rgba(0,0,0,0.04)',
        dropdown: '0px 0.175px 1.041px 0px rgba(0,0,0,0.01), 0px 0.8px 2.925px 0px rgba(0,0,0,0.02), 0px 2.025px 7.847px 0px rgba(0,0,0,0.027), 0px 4px 18px 0px rgba(0,0,0,0.04)',
      },
      fontSize: {
        h1: ['64px', '64px'],
        h2: ['48px', '56px'],
        h3: ['32px', '40px'],
        h4: ['24px', '32px'],
        h5: ['18px', '28px'],
        subheading: ['16px', '24px'],
        body: ['16px', '24px'],
        'body-small': ['14px', '20px'],
        button: ['16px', '24px'],
        caption: ['12px', '16px'],
        code: ['14px', '20px'],
      },
    },
  },
  plugins: [],
}
