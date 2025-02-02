/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Add custom colors if needed
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}