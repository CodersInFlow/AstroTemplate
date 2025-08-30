/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
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
      colors: {
        // Blog component semantic colors - Preston's light theme
        'blog-bg': '#ffffff',
        'blog-card-bg': '#f3f4f6',
        'blog-card-hover': '#e5e7eb',
        'blog-border': '#e5e7eb',
        
        'blog-text-primary': '#000000',
        'blog-text-secondary': '#4b5563',
        'blog-text-muted': '#6b7280',
        'blog-text-body': '#374151',
        
        'blog-accent': '#4b5563',
        'blog-accent-hover': '#000000',
        
        'blog-category-bg': '#1f2937',
        'blog-category-hover': '#374151',
        'blog-category-text': '#ffffff',
        
        'blog-code-bg': '#f3f4f6',
        'blog-code-inline-bg': '#f3f4f6',
        'blog-quote-border': '#d1d5db',
        
        'blog-author-avatar-bg': '#1f2937',
        'blog-author-avatar-text': '#ffffff',
      },
    },
  },
  plugins: [],
}