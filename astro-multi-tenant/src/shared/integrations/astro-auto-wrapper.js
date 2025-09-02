// Astro integration that preprocesses .astro files before compilation
import fs from 'fs/promises';
import path from 'path';

export function astroAutoWrapper() {
  // Store original file contents to restore them later
  const originalFiles = new Map();
  
  return {
    name: 'astro-auto-wrapper',
    hooks: {
      'astro:config:setup': ({ updateConfig, command }) => {
        if (command === 'build' || command === 'dev') {
          updateConfig({
            vite: {
              plugins: [{
                name: 'astro-wrapper-transform',
                enforce: 'pre',
                
                async load(id) {
                  // Only process .astro files in sites/*/pages directories
                  if (!id.endsWith('.astro') || !id.includes('/sites/') || !id.includes('/pages/')) {
                    return null;
                  }
                  
                  // Skip files that already have DevWrapper
                  const content = await fs.readFile(id, 'utf-8');
                  if (content.includes('DevWrapper')) {
                    return null;
                  }
                  
                  const fileName = path.basename(id);
                  console.log('Processing for wrapping:', fileName);
                  
                  // Check if this file imports components and JSON data
                  const hasComponentImports = /import\s+\w+\s+from\s+['"].*\/components\//.test(content);
                  const hasDataImports = /import\s+\w+\s+from\s+['"].*\.json['"]/.test(content);
                  
                  if (!hasComponentImports || !hasDataImports) {
                    return null;
                  }
                  
                  // Find the frontmatter section
                  const frontmatterEnd = content.indexOf('---', 3);
                  if (frontmatterEnd === -1) {
                    return null;
                  }
                  
                  const frontmatter = content.substring(0, frontmatterEnd + 3);
                  const template = content.substring(frontmatterEnd + 3);
                  
                  // Pattern to match components with data props
                  const componentPattern = /<(\w+)\s+([^>]*(?:data|Data|header|Header|items|Items|projectItems|experienceItems|headerData|skillsData|contactData)=\{[^}]+\}[^>]*)(\/>|>[\s\S]*?<\/\1>)/g;
                  
                  let modifiedTemplate = template;
                  let needsImport = false;
                  const wrappedComponents = [];
                  
                  modifiedTemplate = modifiedTemplate.replace(componentPattern, (match, componentName, props, closing) => {
                    // Extract data file name from props
                    const propMatches = [...props.matchAll(/(\w+)=\{([^}]+)\}/g)];
                    let dataFile = null;
                    
                    for (const [, propName, propValue] of propMatches) {
                      // Skip non-data props
                      if (propName === 'class' || propName === 'className' || propName === 'id') continue;
                      
                      // Check if the prop value looks like imported data
                      if (propValue.includes('Data') || propValue.includes('data')) {
                        // Convert to filename
                        const fileName = propValue.trim()
                          .replace(/Data$/, '')
                          .replace(/([A-Z])/g, '-$1')
                          .toLowerCase()
                          .replace(/^-/, '') + '.json';
                        
                        dataFile = fileName;
                        break;
                      }
                    }
                    
                    if (dataFile) {
                      needsImport = true;
                      const componentId = `${componentName.toLowerCase()}-auto`;
                      wrappedComponents.push(componentName);
                      
                      console.log(`  -> Wrapping ${componentName} with dataPath: ${dataFile}`);
                      
                      // Wrap with DevWrapper
                      if (closing === '/>') {
                        return `<DevWrapper componentName="${componentName}" dataPath="${dataFile}" componentId="${componentId}">
  <${componentName} ${props}/>
</DevWrapper>`;
                      } else {
                        const innerContent = closing.substring(1, closing.lastIndexOf(`</${componentName}>`));
                        return `<DevWrapper componentName="${componentName}" dataPath="${dataFile}" componentId="${componentId}">
  <${componentName} ${props}>${innerContent}</${componentName}>
</DevWrapper>`;
                      }
                    }
                    
                    return match;
                  });
                  
                  if (needsImport) {
                    console.log(`  -> Wrapped components: ${wrappedComponents.join(', ')}`);
                    
                    // Add DevWrapper import to frontmatter
                    const importStatement = `import DevWrapper from '../../../shared/components/Dev/DevWrapper.astro';`;
                    const modifiedFrontmatter = frontmatter.replace(
                      /\n---$/,
                      `\n${importStatement}\n---`
                    );
                    
                    // Return the modified content
                    return modifiedFrontmatter + modifiedTemplate;
                  }
                  
                  return null;
                }
              }]
            }
          });
        }
      }
    }
  };
}