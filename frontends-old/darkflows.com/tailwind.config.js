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
        // CSS Variable-based colors for theming
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          dark: 'rgb(var(--primary-dark) / <alpha-value>)',
          light: 'rgb(var(--primary-light) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          dark: 'rgb(var(--accent-dark) / <alpha-value>)',
        },
        background: {
          DEFAULT: 'rgb(var(--background) / <alpha-value>)',
          secondary: 'rgb(var(--background-secondary) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          light: 'rgb(var(--surface-light) / <alpha-value>)',
          hover: 'rgb(var(--surface-hover) / <alpha-value>)',
        },
        foreground: {
          DEFAULT: 'rgb(var(--foreground) / <alpha-value>)',
          secondary: 'rgb(var(--foreground-secondary) / <alpha-value>)',
          muted: 'rgb(var(--foreground-muted) / <alpha-value>)',
          subtle: 'rgb(var(--foreground-subtle) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'rgb(var(--success) / <alpha-value>)',
          dark: 'rgb(var(--success-dark) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--warning) / <alpha-value>)',
          dark: 'rgb(var(--warning-dark) / <alpha-value>)',
        },
        error: {
          DEFAULT: 'rgb(var(--error) / <alpha-value>)',
          dark: 'rgb(var(--error-dark) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'rgb(var(--info) / <alpha-value>)',
          dark: 'rgb(var(--info-dark) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--border) / <alpha-value>)',
          light: 'rgb(var(--border-light) / <alpha-value>)',
          focus: 'rgb(var(--border-focus) / <alpha-value>)',
        },
        
        // Blog component semantic colors - Dark Red theme (DarkFlows style)
        'blog-bg': '#000000', // pure black
        'blog-card-bg': '#1a0000', // very dark red
        'blog-card-hover': '#2a0000', // dark red hover
        'blog-border': '#dc2626', // red-600
        
        'blog-text-primary': '#ffffff', // white
        'blog-text-secondary': '#f87171', // red-400
        'blog-text-muted': '#ef4444', // red-500
        'blog-text-body': '#fbbf24', // amber-400
        
        'blog-accent': '#dc2626', // red-600
        'blog-accent-hover': '#ef4444', // red-500
        
        'blog-category-bg': '#991b1b', // red-800
        'blog-category-hover': '#dc2626', // red-600
        'blog-category-text': '#ffffff', // white
        
        'blog-code-bg': '#1a0000', // very dark red
        'blog-code-inline-bg': '#2a0000', // dark red
        'blog-quote-border': '#dc2626', // red-600
        
        'blog-author-avatar-bg': '#dc2626', // red-600
        'blog-author-avatar-text': '#ffffff', // white
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'var(--radius-sm)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        DEFAULT: 'var(--shadow)',
        lg: 'var(--shadow-lg)',
      },
      transitionDuration: {
        DEFAULT: 'var(--transition)',
        slow: 'var(--transition-slow)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
