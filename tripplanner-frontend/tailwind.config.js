/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all React files
  ],
  theme: {
    extend: {
      colors: {
        'emerald-500': '#16A34A',
        'emerald-800': '#0D5D2D',
        'emerald-900': '#063B1C',
      }
    }, // Customize themes here if needed
  },
  plugins: [
    require('@tailwindcss/forms'), // Add this line
  ],
};
