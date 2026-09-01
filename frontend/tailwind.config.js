/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#060913',
        'cyber-cyan': '#00f3ff',
        'cyber-green': '#00ff66',
        'cyber-amber': '#ffb800',
        'cyber-red': '#ff3366',
        'cyber-purple': '#9d4edd',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
