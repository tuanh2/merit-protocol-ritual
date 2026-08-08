/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ritual: {
          DEFAULT: '#00E575',
          hover: '#00C865',
          emerald: '#10B981',
          dark: '#050807',
          surface: '#0a120e',
          card: '#0f1b15',
          border: 'rgba(0, 229, 117, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
