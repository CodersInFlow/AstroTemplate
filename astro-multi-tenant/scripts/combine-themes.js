#!/usr/bin/env node

/**
 * Combines multiple Tailwind configurations into a single CSS file with theme scoping
 * This allows runtime theme switching based on data-theme attribute
 */

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

// Site configurations
const sites = [
  { name: 'codersinflow', path: 'codersinflow.com' },
  { name: 'darkflows', path: 'darkflows.com' },
  { name: 'prestongarrison', path: 'prestongarrison.com' }
];

// Base CSS input
const baseCss = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

async function generateThemeCSS(site) {
  console.log(`Generating CSS for ${site.name}...`);
  
  const configPath = path.join(__dirname, '..', 'src', 'sites', site.path, 'tailwind.config.js');
  
  if (!fs.existsSync(configPath)) {
    console.error(`Config not found: ${configPath}`);
    return '';
  }

  // Load the site's Tailwind config
  delete require.cache[require.resolve(configPath)];
  const config = require(configPath);
  
  // Process CSS with Tailwind
  const result = await postcss([
    tailwindcss(config),
    autoprefixer()
  ]).process(baseCss, {
    from: undefined,
    to: undefined
  });

  // Wrap all rules in theme selector
  const wrappedCss = wrapInThemeSelector(result.css, site.name);
  
  return wrappedCss;
}

function wrapInThemeSelector(css, themeName) {
  // Parse the CSS
  const root = postcss.parse(css);
  
  // Process each rule
  root.walkRules(rule => {
    // Skip keyframe rules and other at-rules
    if (rule.parent && rule.parent.type === 'atrule' && 
        ['keyframes', 'media', 'supports'].includes(rule.parent.name)) {
      return;
    }
    
    // Skip :root and html selectors (keep them global)
    if (rule.selector.includes(':root') || rule.selector === 'html') {
      return;
    }
    
    // Wrap selector with theme attribute
    // Handle multiple selectors (comma-separated)
    rule.selector = rule.selector
      .split(',')
      .map(selector => {
        selector = selector.trim();
        
        // Special handling for * selector
        if (selector === '*') {
          return `[data-theme="${themeName}"] ${selector}`;
        }
        
        // Special handling for ::before, ::after pseudo-elements
        if (selector.includes('::')) {
          const parts = selector.split('::');
          return `[data-theme="${themeName}"] ${parts[0]}::${parts[1]}`;
        }
        
        // Regular selectors
        return `[data-theme="${themeName}"] ${selector}`;
      })
      .join(', ');
  });
  
  return root.toString();
}

async function generateBaseStyles() {
  // Generate base styles that apply to all themes
  const baseStyles = `
/* Base styles for all themes */
:root {
  --font-sans: Inter, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: var(--font-sans);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Theme detection helper classes */
[data-theme="codersinflow"] {
  /* CodersInFlow theme active */
}

[data-theme="darkflows"] {
  /* DarkFlows theme active */
}

[data-theme="prestongarrison"] {
  /* PrestonGarrison theme active */
}
`;

  return baseStyles;
}

async function combineThemes() {
  console.log('Starting theme combination...');
  
  let combinedCss = await generateBaseStyles();
  
  // Generate CSS for each site
  for (const site of sites) {
    const themeCss = await generateThemeCSS(site);
    if (themeCss) {
      combinedCss += `\n\n/* ===== ${site.name.toUpperCase()} THEME ===== */\n`;
      combinedCss += themeCss;
    }
  }
  
  // Write combined CSS to file
  const outputPath = path.join(__dirname, '..', 'src', 'styles', 'themes.css');
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, combinedCss);
  console.log(`✅ Combined themes written to ${outputPath}`);
  
  // Also create a minified version
  const minifiedResult = await postcss([
    require('cssnano')({
      preset: 'default'
    })
  ]).process(combinedCss, {
    from: undefined,
    to: undefined
  });
  
  const minOutputPath = path.join(__dirname, '..', 'src', 'styles', 'themes.min.css');
  fs.writeFileSync(minOutputPath, minifiedResult.css);
  console.log(`✅ Minified themes written to ${minOutputPath}`);
}

// Run if called directly
if (require.main === module) {
  combineThemes().catch(console.error);
}

module.exports = { combineThemes, generateThemeCSS };