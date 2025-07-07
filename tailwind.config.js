/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Medical Trust Color Palette - FIXED: Added missing shades
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#0066CC',
          600: '#0066CC', // Main primary color
          700: '#0052a3', // Darker shade for hover
          800: '#004085',
          900: '#002d66'
        },
        // FIXED: Added secondary colors that your components expect
        secondary: {
          50: '#f0fdf4',
          500: '#00A86B',
          600: '#00A86B', // Main secondary color
          700: '#059669'
        },
        // FIXED: Added accent colors that your components expect  
        accent: {
          500: '#FF6B35',
          600: '#e55a2b'
        },
        // FIXED: Added neutral colors that your components expect
        neutral: {
          50: '#F8FAFC'
        },
        // Keep your existing medical colors as aliases
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