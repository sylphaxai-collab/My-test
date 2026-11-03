import type { Config } from 'tailwindcss';

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
      },
    },
  },
  plugins: [],
} satisfies Config;
