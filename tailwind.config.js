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
          DEFAULT: '#FF9B9B',
          light: '#FFB4B4',
          dark: '#FF6B6B',
        },
        secondary: {
          DEFAULT: '#FFD93D',
        },
        accent: {
          DEFAULT: '#6BCB77',
        },
        error: {
          DEFAULT: '#FF6B6B',
        },
        hour: {
          hand: '#1F2937',
        },
        minute: {
          hand: '#6366F1',
        },
        second: {
          hand: '#EF4444',
        },
      },
      fontFamily: {
        display: ['"ZCOOL KuaiLe"', 'cursive'],
        ui: ['"Baloo 2"', 'sans-serif'],
      },
      fontSize: {
        'h1': '2.5rem',
        'h2': '2rem',
        'h3': '1.5rem',
        'h4': '1.25rem',
        'clock-hour': '3rem',
        'clock-minute': '2.5rem',
        'clock-second': '2rem',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#FF9B9B",
          "primary-content": "#FFFFFF",
          "secondary": "#FFD93D",
          "secondary-content": "#1F2937",
          "accent": "#6BCB77",
          "accent-content": "#FFFFFF",
          "neutral": "#374151",
          "neutral-content": "#F3F4F6",
          "base-100": "#FFFFFF",
          "base-200": "#FFF0F5",
          "base-300": "#FFE4E1",
          "base-content": "#4A4A4A",
          "info": "#4D96FF",
          "success": "#6BCB77",
          "warning": "#FFD93D",
          "error": "#FF6B6B",
        },
        eyecare: {
          "primary": "#B2A4FF",
          "primary-content": "#FFFFFF",
          "secondary": "#FFB4B4",
          "secondary-content": "#4A4A4A",
          "accent": "#C1EFFF",
          "accent-content": "#4A4A4A",
          "neutral": "#78350F",
          "neutral-content": "#FFFBEB",
          "base-100": "#FFFBEB",
          "base-200": "#FEF3C7",
          "base-300": "#FDE68A",
          "base-content": "#78350F",
          "info": "#C1EFFF",
          "success": "#B2C8DF",
          "warning": "#FFB4B4",
          "error": "#FF9B9B",
        },
      },
    ],
  },
}
