#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load site config
const config = JSON.parse(fs.readFileSync('site.config.json', 'utf8'));

// Generate JWT secret if not exists
const jwtSecret = crypto.randomBytes(32).toString('hex');

// Prepare template variables
const vars = {
    SITE_NAME: config.site.name,
    DISPLAY_NAME: config.site.displayName,
    DOMAIN: config.site.domain,
    DESCRIPTION: config.site.description,
    
    FRONTEND_PORT: config.ports.frontend,
    BACKEND_PORT: config.ports.backend,
    MONGODB_PORT: config.ports.mongodb,
    
    DATABASE_NAME: config.database.name,
    DATABASE_USER: config.database.user || 'admin',
    DATABASE_PASSWORD: config.database.password || '',
    
    ADMIN_EMAIL: config.admin.email,
    ADMIN_PASSWORD: config.admin.password,
    ADMIN_NAME: config.admin.name,
    
    SERVER_HOST: config.deployment.server.host,
    SERVER_USER: config.deployment.server.user,
    SERVER_PORT: config.deployment.server.port,
    SERVER_PATH: config.deployment.server.path,
    
    UPLOADS_PATH: config.paths.uploads,
    LOGS_PATH: config.paths.logs,
    
    JWT_SECRET: jwtSecret,
    
    PRIMARY_COLOR: config.theme.primaryColor,
    ACCENT_COLOR: config.theme.accentColor
};

// Function to process template
function processTemplate(templatePath, outputPath) {
    let content = fs.readFileSync(templatePath, 'utf8');
    
    // Replace all {{VARIABLE}} with actual values
    Object.entries(vars).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        content = content.replace(regex, value);
    });
    
    // Check for any remaining placeholders
    const remaining = content.match(/{{[^}]+}}/g);
    if (remaining) {
        console.warn(`Warning: Unresolved placeholders in ${templatePath}:`, remaining);
    }
    
    fs.writeFileSync(outputPath, content);
    console.log(`✅ Generated: ${outputPath}`);
    
    return outputPath;
}

// Create output directory
const outputDir = path.join(__dirname, '..', 'generated-configs');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Process all templates
const templatesDir = path.join(__dirname, '..', 'templates');
const templates = [
    {
        input: 'nginx.conf.template',
        output: `nginx-${config.site.name}.conf`
    },
    {
        input: 'backend.service.template', 
        output: `${config.site.name}-backend.service`
    },
    {
        input: 'frontend.service.template',
        output: `${config.site.name}-frontend.service`
    }
];

console.log('🔧 Generating configuration files from templates...\n');

templates.forEach(template => {
    const inputPath = path.join(templatesDir, template.input);
    const outputPath = path.join(outputDir, template.output);
    
    if (fs.existsSync(inputPath)) {
        processTemplate(inputPath, outputPath);
    } else {
        console.error(`❌ Template not found: ${inputPath}`);
    }
});

// Generate deployment instructions
const instructions = `
Deployment Instructions for ${config.site.displayName}
========================================

1. Copy nginx configuration:
   scp -P ${config.deployment.server.port} generated-configs/nginx-${config.site.name}.conf ${config.deployment.server.user}@${config.deployment.server.host}:/etc/nginx/sites-available/${config.site.name}.conf
   
2. Copy systemd services:
   scp -P ${config.deployment.server.port} generated-configs/*.service ${config.deployment.server.user}@${config.deployment.server.host}:/etc/systemd/system/
   
3. Enable services on server:
   ssh -p ${config.deployment.server.port} ${config.deployment.server.user}@${config.deployment.server.host}
   systemctl daemon-reload
   systemctl enable ${config.site.name}-backend
   systemctl enable ${config.site.name}-frontend
   ln -s /etc/nginx/sites-available/${config.site.name}.conf /etc/nginx/sites-enabled/
   nginx -t && systemctl reload nginx

4. Start services:
   systemctl start ${config.site.name}-backend
   systemctl start ${config.site.name}-frontend

Generated JWT Secret: ${jwtSecret}
Save this securely!
`;

fs.writeFileSync(path.join(outputDir, 'DEPLOYMENT.md'), instructions);
console.log('\n📄 Deployment instructions saved to: generated-configs/DEPLOYMENT.md');
console.log('\n✨ Configuration generation complete!');