/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{html,js,jsx}',
    './components/**/*.{html,js,jsx}'
  ],
  theme: {
    extend: {},
    screens: {
      'sm': '460px',
      'md': '839px',
      'lg': '1024px'
    }
  },
  plugins: [],
}
