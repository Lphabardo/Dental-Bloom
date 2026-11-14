/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bloom: {
          primary: '#D985A8',
          dark: '#B95783',
          light: '#FBEAF1',
          bg: '#FFF9F6',
          text: '#34313A',
          muted: '#817782',
          border: '#F0E4E9',
        }
      }
    },
  },
  plugins: [],
}