/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
      },
      animation: {
        'star-movement-bottom': 'star-movement-bottom linear infinite',
        'star-movement-top': 'star-movement-top linear infinite',
      },
      keyframes: {
        'star-movement-bottom': {
          '0%': { transform: 'translate(0%, 0%)' },
          '100%': { transform: 'translate(-100%, 0%)' },
        },
        'star-movement-top': {
          '0%': { transform: 'translate(0%, 0%)' },
          '100%': { transform: 'translate(100%, 0%)' },
        }
      }
    },
  },
  plugins: []
}
