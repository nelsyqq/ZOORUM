/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        ink: '#2C2416',
        cream: '#FFFAF3',
        line: '#EDE4D8',
        muted: '#8A7B6A',
        forest: {
          DEFAULT: '#3D8B6E',
          dark: '#2D6A54',
          light: '#E8F5EF',
          50: '#F0F9F4',
          100: '#D8F0E4',
        },
        honey: {
          DEFAULT: '#E9A319',
          dark: '#C8870E',
          light: '#FFF4D6',
        },
        coral: '#E07A5F',
        sky: { DEFAULT: '#5B9BD5', light: '#EBF4FC' },
      },
      fontFamily: {
        display: ['"Baloo 2"', 'sans-serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      maxWidth: { wrap: '1200px' },
      borderRadius: {
        blob: '2rem',
        paw: '1.25rem',
      },
      boxShadow: {
        soft: '0 8px 32px rgba(44, 36, 22, 0.08)',
        paw: '0 12px 40px rgba(61, 139, 110, 0.2)',
        honey: '0 8px 24px rgba(233, 163, 25, 0.35)',
      },
      backgroundImage: {
        paws: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233D8B6E' fill-opacity='0.06'%3E%3Cpath d='M30 35c-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5 3.5-1.5 3.5-3.5S32 35 30 35zm-8-6c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5S23.5 29 22 29zm16 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5S39.5 29 38 29zm-12-7c-1.2 0-2 .8-2 2s.8 2 2 2 2-.8 2-2-.8-2-2-2zm8 0c-1.2 0-2 .8-2 2s.8 2 2 2 2-.8 2-2-.8-2-2-2z'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-right': {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-left': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'fade-up': 'fade-up 0.6s ease-out',
        'fade-down': 'fade-down 0.5s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
        'slide-right': 'slide-right 0.5s ease-out',
        'slide-left': 'slide-left 0.5s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
