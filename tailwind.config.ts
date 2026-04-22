import type { Config } from 'tailwindcss'

const config: Config = {
  // Tailwind only scans these paths — homepage styles are inline, not Tailwind
  content: [
    './app/client/**/*.{js,ts,jsx,tsx}',
    './app/login/**/*.{js,ts,jsx,tsx}',
    './app/api/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-creatodisplay)', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        brand: {
          black:       '#000000',
          white:       '#ffffff',
          off:         '#f5f5f5',
          accent:      '#c8f542',
          'accent-dim':'#a8d030',
          subtle:      'rgba(255,255,255,0.06)',
          border:      'rgba(255,255,255,0.10)',
          muted:       'rgba(255,255,255,0.40)',
        },
      },
      transitionTimingFunction: {
        'out-expo':      'cubic-bezier(0.23,1,0.32,1)',
        'drawer':        'cubic-bezier(0.32,0.72,0,1)',
        'in-out-strong': 'cubic-bezier(0.77,0,0.175,1)',
      },
    },
  },
  plugins: [],
}

export default config
