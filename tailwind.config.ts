import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        primary: {
          light: '#B99F85',
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
        }
      },
    },
  },
}
