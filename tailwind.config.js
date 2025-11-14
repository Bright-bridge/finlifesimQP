/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0f172a',
          card: '#0b1220',
          accent: '#F59E0B',
          accent2: '#D69E2E',
          purple: '#6D28D9'
        }
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.25)'
      },
      fontFamily: {
        inter: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

