import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'
// import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        sandrift: {
          DEFAULT: '#B99F85',
          '50': '#f9f6f3',
          '100': '#f0ece4',
          '200': '#e0d6c8',
          '300': '#ccbba5',
          '400': '#b99f85',
          '500': '#a88567',
          '600': '#9a745c',
          '700': '#815f4d',
          '800': '#694e43',
          '900': '#564138',
          '950': '#2d211d',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
}
