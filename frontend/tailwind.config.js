/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: { hot: '#FF4FA3', deep: '#E23A8C', soft: '#FFD6EA' },
        cherry: { DEFAULT: '#E8333A', deep: '#C4272E', soft: '#FFD9D4' },
        tangerine: { DEFAULT: '#FF9A3C', deep: '#F07E14', soft: '#FFE3C4' },
        lemon: { DEFAULT: '#FFD93D', deep: '#F2C200', soft: '#FFF3C2' },
        aqua: { DEFAULT: '#38C6C6', deep: '#22A0A0', soft: '#D2F3F3' },
        cream: { DEFAULT: '#FFF4E2', dark: '#FBEBD3', deep: '#F5DDB8' },
        cocoa: { DEFAULT: '#3A2318', soft: '#5C3A28', fade: '#8A6A55' },
      },
      fontFamily: {
        display: ['Shrikhand', 'cursive'],
        body: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        pop: '4px 4px 0 0 #3A2318',
        'pop-sm': '2px 2px 0 0 #3A2318',
        'pop-lg': '6px 6px 0 0 #3A2318',
      },
      keyframes: {
        bob: {
          '0%, 100%': { transform: 'translateY(0) rotate(-1deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1.5deg)' },
        },
        bobSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        rise: {
          '0%': { transform: 'translateY(0) scale(0.6)', opacity: '0' },
          '15%': { opacity: '0.9' },
          '100%': { transform: 'translateY(-260px) scale(1.1)', opacity: '0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg) scale(1.04)' },
          '75%': { transform: 'rotate(3deg) scale(1.04)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        twinkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.85' },
          '50%': { transform: 'scale(1.25) rotate(12deg)', opacity: '1' },
        },
      },
      animation: {
        bob: 'bob 5s ease-in-out infinite',
        'bob-slow': 'bobSlow 4.5s ease-in-out infinite',
        rise: 'rise 4s linear infinite',
        wiggle: 'wiggle 0.35s ease-in-out',
        marquee: 'marquee 26s linear infinite',
        'spin-slow': 'spinSlow 60s linear infinite',
        twinkle: 'twinkle 2.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
