/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',        // primary background
        coal: '#141414',       // raised surfaces
        steel: '#1F1F1F',      // panels
        graphite: '#2A2A2A',   // hover / borders
        silver: '#8A8A8A',     // secondary text
        pale: '#C8C6C0',       // warm grey
        bone: '#F2F0EB',       // primary text (warm white)
        chalk: '#FAFAF7',      // bright moments
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        'ultra': '0.4em',
        'wider-2': '0.18em',
      },
      animation: {
        'marquee': 'marquee 60s linear infinite',
        'ticker': 'ticker 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        ticker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
}
