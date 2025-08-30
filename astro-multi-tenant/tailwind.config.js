// Dynamic Tailwind configuration that loads site-specific config
// This file is required by Astro's Tailwind integration
const site = process.env.SITE || 'codersinflow.com';

// Load and export the site-specific config
const siteConfig = require(`./src/sites/${site}/tailwind.config.cjs`);
module.exports = siteConfig;