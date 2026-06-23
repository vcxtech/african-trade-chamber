import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        atc: {
          navy: '#002740',
          gold: '#e6b14a',
          yellow: '#fece00',
          light: '#f5f7fa',
          muted: '#4a4a4a',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(0, 39, 64, 0.08)',
      },
    },
  },
  plugins: [],
}
export default config
