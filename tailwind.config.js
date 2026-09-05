/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        classic: {
          bg: '#090d16',
          card: '#131b2e',
          border: '#1e2a45',
          dark: '#050810',
          crimson: '#e11d48',
          amber: '#d97706',
          emerald: '#059669',
          navy: '#2563eb',
          slate: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      }
    },
  },
  plugins: [],
}
