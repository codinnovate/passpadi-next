/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
    theme: {
    extend: {
      colors:{
        "gray":{
          100:"#eeeff4",
          500:"#92a2be"
        },
        "red":"#ce2928",
        "purple":"#4c4fde",
        "secondary":"#0b1829",
      }
    },
  },
  plugins: [],
}

