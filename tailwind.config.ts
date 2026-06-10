// tailwind.config.ts
// NOTE: This project uses Tailwind CSS v4. Brand tokens are also defined via
// @theme in src/app/globals.css for native v4 support. This file is kept for
// tooling compatibility and future reference.
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        orange: '#ff4d00',
        black: '#12120f',
        white: '#fffefd',
        'dark-surface': '#1a1a17',
        'dark-border': '#2a2a27',
      },
      fontFamily: {
        headline: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['monospace'],
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter: '-0.03em',
      },
      maxWidth: {
        site: '1440px',
      },
    },
  },
  plugins: [],
}

export default config
