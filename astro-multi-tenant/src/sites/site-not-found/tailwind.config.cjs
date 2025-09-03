const config = require('./config.json');

module.exports = {
  content: [
    './src/sites/site-not-found/**/*.{astro,html,js,jsx,ts,tsx}',
    './src/shared/**/*.{astro,html,js,jsx,ts,tsx}',
    './src/layouts/**/*.{astro,html,js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: config.colors || {
        primary: '#ef4444',
        secondary: '#64748b',
        accent: '#f59e0b',
        background: '#111827',
        surface: '#1f2937',
        'surface-hover': '#374151',
        'text-primary': '#f3f4f6',
        'text-secondary': '#9ca3af',
        'text-inverse': '#111827',
        border: '#374151',
        error: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b',
        info: '#3b82f6',
        link: '#60a5fa',
        'link-hover': '#93c5fd',
        'code-bg': '#1f2937',
        'code-text': '#e5e7eb'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ]
}