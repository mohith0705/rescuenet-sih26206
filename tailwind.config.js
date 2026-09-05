/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          sidebar: '#f1f5f9',
          text: '#0f172a',
          muted: '#64748b'
        },
        emergency: {
          red: '#dc2626',
          brightRed: '#ef4444',
          darkRed: '#991b1b'
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
