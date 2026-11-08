import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'cream': '#FFF9F0',
        'soft-pink': '#FADADD',
        'soft-pink-dark': '#F4B2B2',
        'cream-dark': '#EDE1D0',
        'navy': '#0a192f',
        'gold': '#D4AF37',
        'soft-gray': '#D3D3D3',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [typography],
} satisfies Config;
