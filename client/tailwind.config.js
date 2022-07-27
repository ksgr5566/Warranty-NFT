/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{html,js,jsx}',
    './components/**/*.{html,js,jsx}'
  ],
  theme: {
    extend: {},
    screens: {
      '2xs': '250px',
      'xs': '300px',
      'sm': '460px',
      'bet': '600px',
      'md': '839px',
      'lg': '1024px'
    }
  },
  plugins: [],
}
