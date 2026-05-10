/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto Slab', 'sans-serif'],
        'oxanium': ['Oxanium', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
