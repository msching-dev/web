import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

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
      animation: {
        'fade-in': 'fade-in 300ms ease-in',
      },
      keyframes: {
        'fade-in': {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
      },
    },
  },
}
