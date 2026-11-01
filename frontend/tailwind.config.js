/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        military: {
          olive: '#43503E',
          'olive-dark': '#2C3629',
          'olive-deep': '#1A2118',
          'olive-light': '#5B6C55',
          'olive-muted': '#7D8E77',
          khaki: '#D6CEBE',
          sand: '#EBE5D9',
          parchment: '#F6F4EF',
          cream: '#FCFBF8',
          charcoal: '#1E2420',
          graphite: '#313934',
          steel: '#515C55',
          subtle: '#78847C',
          border: '#DED8CB',
          'border-dark': '#384337',
          amber: '#C97708',
          red: '#C53030',
          green: '#2D6A4F',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        tactical: ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        'military-subtle': '0 1px 3px rgba(30, 36, 32, 0.08), 0 1px 2px rgba(30, 36, 32, 0.04)',
        'military-card': '0 4px 12px rgba(30, 36, 32, 0.06)',
        'military-elevated': '0 12px 28px rgba(30, 36, 32, 0.12)',
      },
    },
  },
  plugins: [],
}
