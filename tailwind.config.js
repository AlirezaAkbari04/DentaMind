/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Medical Trust Color Palette
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#0066CC',
          600: '#0056b3',
          700: '#004499',
          800: '#003880',
          900: '#002d66'
        },
        medical: {
          green: '#00A86B',
          orange: '#FF6B35',
          slate: '#F8FAFC'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}