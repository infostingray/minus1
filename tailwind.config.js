/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep charcoals
        ink: '#1A1A1A',        // primary dark bg (was #0A0A0A)
        coal: '#0F0F0F',       // deeper black
        steel: '#252525',
        graphite: '#3A3A3A',
        // Industrial silvers
        silver: '#8E8E93',
        chrome: '#B5B5B8',
        pale: '#D4D4D6',
        bone: '#E8E8E5',       // cool off-white (was warm #F2F0EB)
        chalk: '#F5F5F4',
        // Safety accent
        orange: '#FF6B1A',
        'orange-bright': '#FF8533',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        scan: 'scan 8s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scan: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: 0 },
          '50%': { transform: 'translateY(100%)', opacity: 0.6 },
        },
      },
    },
  },
  plugins: [],
};
