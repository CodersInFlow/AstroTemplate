/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/sites/codersinflow.com/**/*.{astro,tsx}',
    './src/modules/blog/**/*.{astro,tsx}',
    './src/shared/components/**/*.{astro,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Semantic colors for dark theme with blue accent
        'primary': '#3B82F6',         // blue-500 - main brand color
        'secondary': '#8B5CF6',       // violet-500
        'accent': '#10B981',          // green-500
        'background': '#111827',      // gray-900 - page background
        'surface': '#1F2937',         // gray-800 - card backgrounds
        'surface-hover': '#374151',   // gray-700 - hover state
        'border': '#374151',          // gray-700 - borders
        
        // Text colors
        'text-primary': '#F3F4F6',    // gray-100 - main text
        'text-secondary': '#D1D5DB',  // gray-300 - secondary text
        'text-muted': '#6B7280',      // gray-500 - muted text
        'text-inverse': '#111827',    // gray-900 - text on light backgrounds
        
        // Interactive elements
        'link': '#60A5FA',            // blue-400
        'link-hover': '#93C5FD',      // blue-300
        
        // Status colors
        'success': '#10B981',         // green-500
        'warning': '#F59E0B',         // yellow-500
        'error': '#EF4444',           // red-500
        'info': '#3B82F6',            // blue-500
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'gradient': 'gradient 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}