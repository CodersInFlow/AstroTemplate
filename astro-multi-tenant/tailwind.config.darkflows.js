/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/layouts/darkflows.com/**/*.{astro,tsx}',
    './src/components/darkflows.com/**/*.{astro,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#DC2626',
        secondary: '#EA580C', 
        accent: '#FACC15',
        background: '#1a0000',
        'dark-red': '#7f1d1d',
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'],
      },
      animation: {
        'pulse-red': 'pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fire': 'fire 3s ease-in-out infinite',
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(220, 38, 38, 0.5)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}