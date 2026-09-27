module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eff5ff',
          100: '#dbe7ff',
          200: '#bfd4ff',
          300: '#93b6ff',
          400: '#608cf9',
          500: '#2f6bed',
          600: '#1b54d6',
          700: '#1742ad',
          800: '#193a8a',
          900: '#1a376f',
        },
      },
      borderRadius: {
        xl: '20px',
        '2xl': '24px',
        '3xl': '28px',
        '4xl': '34px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 18px 40px -16px rgba(15, 23, 42, 0.18)',
        soft: '0 1px 2px rgba(15, 23, 42, 0.05), 0 8px 24px -12px rgba(15, 23, 42, 0.16)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        float: 'floatY 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
