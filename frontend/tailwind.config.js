/** @type {import('tailwindcss').Config} */
export default {
  content: [
     "./index.html",                  
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1d4ed8", // blue-600
          light: "#DBEAFE",   // blue-500
          dark: "#1e3a8a",    // blue-800
        },
        secondary: {
          DEFAULT: "#0f172a", // slate-900
          light: "#334155",   // slate-700
          dark: "#1F2937",    // slate-950
        },
        accent: {
          success: "#16a34a", // green-600
          warning: "#f59e0b", // amber-500
          danger: "#dc2626",  // red-600
        },
      },
    },
    
  },
  plugins: [],
}

