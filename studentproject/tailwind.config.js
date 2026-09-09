/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors:{
        'sky-blue': '#AAC7D7',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["nord"],
  },
}
