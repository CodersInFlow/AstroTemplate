# Multi-Tenant Theming System Documentation

## Overview

This multi-tenant Astro application uses a semantic color theming system with Tailwind CSS. Each site has its own Tailwind configuration that defines semantic color names, allowing consistent theming across all components while maintaining distinct visual identities.

## Architecture

### Semantic Color System

Instead of using hardcoded colors like `text-gray-900` or `bg-blue-500`, we use semantic names that represent the purpose of the color:

- `bg-background` - Main page background
- `bg-surface` - Card/component backgrounds
- `text-text-primary` - Main text color
- `text-text-secondary` - Secondary text color
- `bg-primary` - Primary brand color
- `text-link` - Link color
- etc.

### Build-Time Configuration

The theming system works at build-time, not runtime:

1. The `SITE` environment variable determines which site is being built
2. PostCSS loads the appropriate Tailwind config from the site's folder
3. Tailwind compiles the CSS with the site-specific color values
4. Components use semantic class names that resolve to different colors per site

### File Structure

```
src/sites/
├── codersinflow.com/
│   ├── tailwind.config.js    # Site-specific colors
│   ├── layout.astro          # Site layout
│   ├── config.json           # Site configuration
│   └── pages/
│       ├── index.astro
│       └── blog/
│           └── [...slug].astro
├── darkflows.com/
│   ├── tailwind.config.js    # Site-specific colors
│   └── ...
└── prestongarrison.com/
    ├── tailwind.config.js    # Site-specific colors
    └── ...
```

## Current Sites and Their Themes

### CodersInFlow (Dark Blue Theme)
- Background: `#111827` (gray-900)
- Surface: `#1F2937` (gray-800)
- Primary: `#3B82F6` (blue-500)
- Text: Light colors on dark background

### DarkFlows (Black/Red Theme)
- Background: `#000000` (pure black)
- Surface: `#111827` (gray-900)
- Primary: `#DC2626` (red-600)
- Text: Light colors on black background

### PrestonGarrison (Light Theme)
- Background: `#FFFFFF` (white)
- Surface: `#F9FAFB` (gray-50)
- Primary: `#111827` (gray-900)
- Text: Dark colors on light background

## Semantic Color Definitions

Each Tailwind config should define these semantic colors:

```javascript
colors: {
  // Background colors
  'background': '#FFFFFF',      // Main page background
  'surface': '#F9FAFB',         // Card/component backgrounds
  'surface-hover': '#F3F4F6',   // Hover state for surfaces
  'border': '#E5E7EB',          // Border color
  
  // Text colors
  'text-primary': '#111827',    // Main text
  'text-secondary': '#4B5563',  // Secondary text
  'text-muted': '#9CA3AF',      // Muted/disabled text
  'text-inverse': '#FFFFFF',    // Text on dark backgrounds
  
  // Brand colors
  'primary': '#3B82F6',         // Primary brand color
  'secondary': '#8B5CF6',       // Secondary brand color
  'accent': '#10B981',          // Accent color
  
  // Interactive elements
  'link': '#2563EB',            // Link color
  'link-hover': '#1D4ED8',      // Link hover color
  
  // Status colors (keep consistent)
  'success': '#10B981',         // Success/positive
  'warning': '#F59E0B',         // Warning
  'error': '#EF4444',           // Error/danger
  'info': '#3B82F6',            // Information
}
```

## PostCSS Configuration

The `postcss.config.js` file dynamically loads the correct Tailwind config:

```javascript
const site = process.env.SITE || 'codersinflow.com';
module.exports = {
  plugins: {
    tailwindcss: {
      config: `./src/sites/${site}/tailwind.config.js`
    },
    autoprefixer: {},
  },
};
```

## Development Commands

Each site has its own development and build commands:

```bash
# Development
npm run dev:codersinflow
npm run dev:darkflows
npm run dev:prestongarrison

# Production build
npm run build:codersinflow
npm run build:darkflows
npm run build:prestongarrison
```

## Creating a New Site

Use the provided script to create a new site:

```bash
./create-new-site.sh <sitename.com>
```

This script will:
1. Create the site directory structure
2. Generate a Tailwind config with semantic colors
3. Create layout and page templates using semantic classes
4. Add npm scripts for development and building
5. Set up the blog integration

After creation:
1. Customize colors in `src/sites/<sitename>/tailwind.config.js`
2. Update site configuration in `config.json`
3. Run `npm run dev:<sitename>` to start development

## Best Practices

### DO:
- ✅ Use semantic color names (`bg-background`, `text-primary`)
- ✅ Define all colors in the site's Tailwind config
- ✅ Keep status colors consistent across sites
- ✅ Test each site after making theme changes
- ✅ Use Tailwind classes for all styling

### DON'T:
- ❌ Use hardcoded colors (`bg-gray-900`, `text-blue-500`)
- ❌ Override colors with inline styles
- ❌ Use CSS variables for theming (use Tailwind config)
- ❌ Pass theme props to components
- ❌ Mix semantic and hardcoded color classes

## Converting Hardcoded Colors

When updating components, replace hardcoded colors with semantic ones:

```diff
- <div class="bg-gray-900 text-white border-gray-700">
+ <div class="bg-surface text-text-primary border-border">

- <a class="text-blue-500 hover:text-blue-700">
+ <a class="text-link hover:text-link-hover">

- <button class="bg-indigo-600 text-white">
+ <button class="bg-primary text-text-inverse">
```

## Testing

After making theme changes:

1. Build each site to verify Tailwind compilation:
   ```bash
   npm run build:codersinflow
   npm run build:darkflows
   npm run build:prestongarrison
   ```

2. Test with Playwright or manually verify each site displays its correct theme

3. Check that blog components inherit the correct theme

## Troubleshooting

### Common Issues:

**Issue**: Colors not updating after changes
**Solution**: Restart the dev server - Tailwind config changes require a restart

**Issue**: Class not found errors
**Solution**: Ensure the semantic color is defined in the site's Tailwind config

**Issue**: Blog components showing wrong theme
**Solution**: Verify the blog pages are using semantic classes, not hardcoded colors

**Issue**: Build fails with PostCSS error
**Solution**: Check that the SITE environment variable matches a valid site folder

## Migration Status

✅ **Completed:**
- All three sites migrated to semantic colors
- Blog components updated to use semantic classes
- PostCSS configured for dynamic Tailwind loading
- Site creation script created
- Testing completed with Playwright

## Future Improvements

- Add dark mode toggle support per site
- Create a theme preview tool
- Add more semantic color categories (e.g., `focus`, `disabled`)
- Create shared Tailwind preset for common configurations