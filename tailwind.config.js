/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "../shared-components/src/**/*.{js,jsx,ts,tsx}",
    "../blog-module/src/**/*.{astro,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Blog component semantic colors - Dark theme (Coders style)
        'blog-bg': '#030712', // gray-950
        'blog-card-bg': '#1f2937', // gray-800
        'blog-card-hover': '#374151', // gray-700
        'blog-border': '#374151', // gray-700
        
        'blog-text-primary': '#ffffff', // white
        'blog-text-secondary': '#9ca3af', // gray-400
        'blog-text-muted': '#6b7280', // gray-500
        'blog-text-body': '#d1d5db', // gray-300
        
        'blog-accent': '#3b82f6', // blue-500
        'blog-accent-hover': '#60a5fa', // blue-400
        
        'blog-category-bg': '#3b82f6', // blue-600
        'blog-category-hover': '#2563eb', // blue-700
        'blog-category-text': '#ffffff', // white
        
        'blog-code-bg': '#111827', // gray-900
        'blog-code-inline-bg': '#1f2937', // gray-800
        'blog-quote-border': '#374151', // gray-700
        
        'blog-author-avatar-bg': '#374151', // gray-700
        'blog-author-avatar-text': '#ffffff', // white
      },
    },
  },
  plugins: [],
}
