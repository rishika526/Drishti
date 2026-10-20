/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hud: {
          bg: '#05080f',
          panel: '#090e17',
          card: '#0f1724',
          border: '#1b2a40',
          green: '#00ff9c',
          greenDark: '#00995c',
          amber: '#ffb000',
          amberDark: '#996900',
          red: '#ff3344',
          redDark: '#991f29',
          cyan: '#00e5ff',
          blue: '#1e90ff',
          muted: '#5c708a',
        },
      },
      fontFamily: {
        heading: ['Rajdhani', 'Orbitron', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        tactical: ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        'hud-green': '0 0 15px rgba(0, 255, 156, 0.25)',
        'hud-green-lg': '0 0 25px rgba(0, 255, 156, 0.45)',
        'hud-amber': '0 0 15px rgba(255, 176, 0, 0.25)',
        'hud-red': '0 0 15px rgba(255, 51, 68, 0.35)',
        'hud-cyan': '0 0 15px rgba(0, 229, 255, 0.25)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'sweep 4s linear infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
    },
  },
  plugins: [],
}
