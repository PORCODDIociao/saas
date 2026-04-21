/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#121212',
          800: '#1e1e1e',
          700: '#2d2d2d',
        },
        primary: {
          DEFAULT: '#d4af37', // Gold for Pro/Premium accents
          hover: '#c39e26',
        },
        accent: {
          DEFAULT: '#66fcf1', // The existing digital nomad cyan
          hover: '#45e6da',
        },
        danger: '#cf6679',
        warning: '#fbc02d',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
