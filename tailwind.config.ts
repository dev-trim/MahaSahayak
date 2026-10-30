/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0A2240', // deep navy blue
        saffron: '#FF9933',
        green: '#138808',
        background: '#F5F5F5',
        card: '#FFFFFF',
      },
      borderRadius: {
        xl: '1rem',
      },
      boxShadow: {
        card: '0 4px 6px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
};
