import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      colors: {
        bordeaux: {
          50: '#fdf2f3',
          100: '#fce7e8',
          200: '#f9d2d5',
          300: '#f4adb3',
          400: '#ec7f89',
          500: '#df5163',
          600: '#cb314b',
          700: '#722F37',
          800: '#5a252c',
          900: '#4d2329',
          950: '#2a0f13',
        },
        gold: '#C9A962',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
} satisfies Partial<Config>
