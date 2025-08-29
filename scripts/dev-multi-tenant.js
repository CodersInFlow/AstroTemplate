#!/usr/bin/env node

/**
 * Development server for multi-tenant setup
 * Simulates domain-based routing locally
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Load sites configuration
const sitesConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../sites-config.json'), 'utf8')
);

console.log('🚀 Starting Multi-Tenant Development Server');
console.log('📋 Configured sites:', Object.keys(sitesConfig).filter(k => k !== 'default').join(', '));

// Middleware to serve correct site based on hostname
app.use((req, res, next) => {
  // Get hostname from request
  let hostname = req.hostname || 'localhost';
  
  // For development, check query parameter too
  if (req.query.site) {
    hostname = req.query.site + '.com';
  }
  
  console.log(`📍 Request for: ${hostname}${req.path}`);
  
  // Get site configuration
  const siteConfig = sitesConfig[hostname] || sitesConfig['localhost'] || sitesConfig['default'];
  
  if (!siteConfig) {
    return res.status(404).send('Site not found');
  }
  
  // Path to site's dist folder
  const sitePath = path.join(__dirname, '../frontends', siteConfig.directory, 'dist');
  
  // Check if built files exist
  if (!fs.existsSync(sitePath)) {
    console.log(`⚠️  Site not built: ${siteConfig.directory}`);
    console.log(`   Run: cd frontends/${siteConfig.directory} && npm run build`);
    return res.status(503).send(`
      <h1>Site Not Built</h1>
      <p>The site "${siteConfig.directory}" needs to be built first.</p>
      <pre>cd frontends/${siteConfig.directory} && npm run build</pre>
    `);
  }
  
  // Serve static files for this site
  express.static(sitePath, {
    index: 'index.html',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  })(req, res, (err) => {
    // For SPAs, serve index.html for any route
    if (err && err.statusCode === 404) {
      const indexPath = path.join(sitePath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        next(err);
      }
    } else {
      next(err);
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    sites: Object.keys(sitesConfig),
    mode: 'development'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n✅ Multi-tenant dev server running on port ${PORT}\n`);
  console.log('📝 To test different sites:');
  console.log('   http://localhost:3000/?site=codersinflow');
  console.log('   http://localhost:3000/?site=darkflows\n');
  console.log('   Or add to /etc/hosts:');
  console.log('   127.0.0.1  codersinflow.local darkflows.local\n');
  console.log('   Then visit:');
  console.log('   http://codersinflow.local:3000');
  console.log('   http://darkflows.local:3000\n');
});