/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all React files
  ],
  theme: {
    extend: {}, // Customize themes here if needed
  },
  plugins: [
    require('@tailwindcss/forms'), // Add this line
  ],
};