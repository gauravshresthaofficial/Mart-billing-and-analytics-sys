/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Roboto: ["Roboto", "Poppins", "sans-serif"],
        Poppins: ["Poppins", "sans-serif"]
      },
    },
  },

  plugins: [
    require('tailwindcss-animated')
  ],
};
