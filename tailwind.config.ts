import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-creatodisplay)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        brand: {
          black: '#000000',
          white: '#ffffff',
          off: '#f5f5f5',
          accent: '#c8f542',      // Seven Studios green-yellow
          'accent-dim': '#a8d030',
          subtle: 'rgba(255,255,255,0.06)',
          border: 'rgba(255,255,255,0.10)',
          muted: 'rgba(255,255,255,0.40)',
        },
      },
      animation: {
        'fade-up': 'fadeUp 600ms cubic-bezier(0.23,1,0.32,1) forwards',
        'fade-in': 'fadeIn 400ms cubic-bezier(0.23,1,0.32,1) forwards',
        shimmer: 'shimmer 1.8s linear infinite',
        pulse2: 'pulse2 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse2: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.23,1,0.32,1)',
        'drawer': 'cubic-bezier(0.32,0.72,0,1)',
        'in-out-strong': 'cubic-bezier(0.77,0,0.175,1)',
      },
    },
  },
  plugins: [],
}

export default config
