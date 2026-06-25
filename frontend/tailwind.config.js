/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      },
      colors: {
        ink: '#09111f',
        navy: '#0f2440',
        cobalt: '#1d4ed8',
        amber: '#f59e0b',
        cream: '#f6f2ea'
      },
      boxShadow: {
        glow: '0 20px 60px rgba(29, 78, 216, 0.18)'
      }
    }
  },
  plugins: []
};
