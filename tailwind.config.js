/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html"
    , "./src/**/*.{html,js,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          '150': '#e9edf4',  // replace with the color code you want
        }
        , 'required': '#E53E3E'
      },
      width: {
        '18': '4.5rem',  // 1rem = 16px, so 4.5rem = 72px
      },
      maxWidth: {
        '120': '30rem',  // 1rem = 16px, so 30rem = 480px
      },
      minWidth: {
        '120': '30rem',  // 1rem = 16px, so 30rem = 480px
      },
      padding: {
        '0.25': '0.0625rem',  // 1rem = 16px, so 0.0625rem = 1px
        '0.5': '0.125rem',  // 1rem = 16px, so 0.125rem = 2px
        '1.5': '0.375rem',  // 1rem = 16px, so 0.375rem = 6px
      },
      margin: {
        '0.25': '0.0625rem',  // 1rem = 16px, so 0.0625rem = 1px
        '0.5': '0.125rem',  // 1rem = 16px, so 0.125rem = 2px
        '1.5': '0.375rem',  // 1rem = 16px, so 0.375rem = 6px
      },
      spacing: {
        '1.5': '0.375rem',  // 1rem = 16px, so 0.375rem = 6px
        '1.6': '0.4rem',  // 1rem = 16px, so 0.4rem = 6.4px
      },
      transitionDelay: {
        '800': '800ms',
        '900': '900ms',
        '1100': '1100ms',
      },
      scale: {
        '80': '0.8',
        '85': '0.85',
        '95': '0.95',
        '99': '0.99',
      },
      translate: {
        '18': '4.5rem',
      },
      borderWidth: {
        '1': '1px',
        '1.5': '1.5px',
        '3': '3px',
      },
    },
  },
  plugins: [],
}