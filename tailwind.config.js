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
      },
      width: {
        '18': '4.5rem',  // 1rem = 16px, so 4.5rem = 72px
      },
      transitionDelay: {
        '800': '800ms',
        '900': '900ms',
        '1100': '1100ms',
      },
      scale: {
        '99': '0.99',
      },
      translate: {
        '18': '4.5rem',
      }
    },
  },
  plugins: [],
}