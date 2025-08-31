/** @type {import('tailwindcss').Config} */
const semanticPlugin = require('../../shared/tailwind-semantic-plugin')

module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/sites/magicvideodownloader.com/**/*.{astro,tsx}',
    './src/modules/blog/**/*.{astro,tsx}',
    './src/shared/components/**/*.{astro,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Semantic colors - customize these for your brand
        'primary': '#3B82F6',         // blue-500 - main brand color
        'secondary': '#8B5CF6',       // violet-500
        'accent': '#10B981',          // green-500
        
        // Background colors
        'background': '#FFFFFF',      // white - page background
        'surface': '#F9FAFB',         // gray-50 - card backgrounds
        'surface-hover': '#F3F4F6',   // gray-100 - hover state
        'border': '#E5E7EB',          // gray-200 - borders
        
        // Text colors
        'text-primary': '#111827',    // gray-900 - main text
        'text-secondary': '#4B5563',  // gray-600 - secondary text
        'text-muted': '#9CA3AF',      // gray-400 - muted text
        'text-inverse': '#FFFFFF',    // white - text on dark backgrounds
        
        // Interactive elements
        'link': '#2563EB',            // blue-600
        'link-hover': '#1D4ED8',      // blue-700
        
        // Status colors (keep these consistent)
        'success': '#10B981',         // green-500
        'warning': '#F59E0B',         // yellow-500
        'error': '#EF4444',           // red-500
        'info': '#3B82F6',            // blue-500
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  safelist: [
    // Keep only the classes that aren't defined by the plugin
    'bg-background',
    'bg-primary',
    'bg-secondary',
    'bg-accent',
    'text-text-inverse',
    'border-primary',
    'hover:bg-primary/90',
  ],
  plugins: [
    semanticPlugin,  // Add semantic utility classes
    require('@tailwindcss/typography'),
  ],
}
