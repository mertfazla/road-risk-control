/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spinner': 'spin 1s cubic-bezier(0.50, 0.25, 0.50, 0.75) infinite',
      },
    },
  },
  plugins: [],

}