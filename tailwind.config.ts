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
        'bell-swing': {
          '0%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(10deg)' },
          '20%': { transform: 'rotate(-10deg)' },
          '30%': { transform: 'rotate(8deg)' },
          '40%': { transform: 'rotate(-8deg)' },
          '50%': { transform: 'rotate(5deg)' },
          '60%': { transform: 'rotate(-5deg)' },
          '70%': { transform: 'rotate(3deg)' },
          '80%': { transform: 'rotate(-3deg)' },
          '90%': { transform: 'rotate(1deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'bell-swing': 'bell-swing 3s ease-out infinite',
      },
    },
  },
  plugins: [animate],
}
