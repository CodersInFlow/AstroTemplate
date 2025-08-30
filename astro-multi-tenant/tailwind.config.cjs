/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/sites/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
  ],
  theme: {
    extend: {
      fontSize: {
        titlept: ["84px", "84px"],
        smtitlept: ["44px", "44px"],
        "24pt": ["18px", "26px"],
        budgetpt: ["46px", "42px"],
        pospt: ["26px", "26px"],
        botpt: ["30px", "32px"],
        header_titlept: ["60px", "60px"],
        header_descpt: ["18px", "20px"],
        header_smtitlept: ["40px", "40px"],
        header_smdescpt: ["12px", "14px"],
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
      },
      animation: {
        'fade-in': 'fadeIn 0.7s ease-in-out',
        'zoom-in': 'zoomIn 0.7s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}