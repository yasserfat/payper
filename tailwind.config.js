
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'main-blue': '#2D60FF',
        'second-blue': '#343C6A',
        'third-blue': '#718EBF',
        'main-gray': '#B1B1B1',
        'second-gray': '#454545',
        'third-gray': '#F3F3F5',
        'special-red': '#FF4B4A',
        'special-green': '#41D4A8',
        'special-black': '#232323',
        'special-white': '#ffffffb3',
        'special-one': '#EDF1F7',
      }
    },
  },
  plugins: [],
}

