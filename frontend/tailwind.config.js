/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0B1220',
        surface: {
          DEFAULT: '#F6F8FB',
          dark: '#111827',
        },
        border: {
          DEFAULT: '#E2E8F0',
          dark: '#1F2937',
        },
        brand: {
          blue: {
            50: '#EFF4FF',
            100: '#DBE6FE',
            300: '#93B4FD',
            500: '#3B6FF0',
            600: '#1D4ED8',
            700: '#1739A6',
            900: '#0F235C',
          },
          green: {
            50: '#EFFDF4',
            100: '#D6F8E1',
            300: '#7FE3A8',
            500: '#22B368',
            600: '#16A34A',
            700: '#0F7C38',
            900: '#0A4D24',
          },
        },
      },
      fontFamily: {
        display: ['var(--font-lexend)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jbmono)', 'monospace'],
      },
      backgroundImage: {
        'ledger-lines':
          'repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(29,78,216,0.06) 28px)',
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,18,32,0.04), 0 1px 8px rgba(11,18,32,0.04)',
      },
      borderRadius: {
        xl2: '1rem',
      },
    },
  },
  plugins: [],
}
