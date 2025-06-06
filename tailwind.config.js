/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'theme-orbitron': ['Orbitron', 'sans-serif'],
        'theme-oxanium': ['Oxanium', 'sans-serif'],
        'theme-rubik': ['Rubik', 'sans-serif'], 
        'theme-barlow': ['Barlow', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
