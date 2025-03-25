/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'tv': {
          'bg-primary': 'var(--color-bg-primary)',
          'bg-secondary': 'var(--color-bg-secondary)',
          'text-primary': 'var(--color-text-primary)',
          'text-secondary': 'var(--color-text-secondary)',
          'border': 'var(--color-border)',
          'blue': 'var(--color-blue)',
          'green': 'var(--color-green)',
          'red': 'var(--color-red)',
        }
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        'sidebar-expanded': '240px',
        'sidebar-collapsed': '64px',
      },
      transitionProperty: {
        'width': 'width',
        'spacing': 'margin, padding',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      }
    },
  },
  plugins: [],
};