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
                  // Only process .astro files in sites directories (pages and layout)
                  if (!id.endsWith('.astro') || !id.includes('/sites/')) {
                    return null;
                  }
                  
                  // Only process pages and layout files
                  const isPageFile = id.includes('/pages/');
                  const isLayoutFile = id.endsWith('/layout.astro');
                  if (!isPageFile && !isLayoutFile) {
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
                  
                  // Pattern to match components with any prop that receives imported data
                  // Only match components starting with uppercase (React/Astro components, not HTML elements)
                  const componentPattern = /<([A-Z]\w+)\s+([^>]*\w+=\{[^}]+\}[^>]*)(\/>|>[\s\S]*?<\/\1>)/g;
                  
                  let modifiedTemplate = template;
                  let needsImport = false;
                  const wrappedComponents = [];
                  let componentOrder = 0;
                  
                  modifiedTemplate = modifiedTemplate.replace(componentPattern, (match, componentName, props, closing, offset, str) => {
                    // Check if this component is inside a JSX expression (like {showHeader && ...})
                    // Look for an unclosed { before this component
                    const beforeMatch = str.substring(0, offset);
                    const lastOpenBrace = beforeMatch.lastIndexOf('{');
                    const lastCloseBrace = beforeMatch.lastIndexOf('}');
                    
                    // If there's an unclosed { before this component, don't wrap it
                    if (lastOpenBrace > lastCloseBrace) {
                      return match;
                    }
                    // Extract data file name from props
                    const propMatches = [...props.matchAll(/(\w+)=\{([^}]+)\}/g)];
                    let dataFile = null;
                    
                    for (const [, propName, propValue] of propMatches) {
                      // Skip non-data props
                      if (propName === 'class' || propName === 'className' || propName === 'id' || propName === 'client') continue;
                      
                      // Check if the prop value looks like imported JSON data
                      // Look for variables that end with Data or contain the word data
                      const trimmedValue = propValue.trim();
                      if (trimmedValue.match(/Data$|data/i) && !trimmedValue.startsWith('"') && !trimmedValue.startsWith("'")) {
                        // Convert variable name to likely filename
                        const fileName = trimmedValue
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
                      
                      console.log(`  -> Wrapping ${componentName} with dataPath: ${dataFile}, order: ${componentOrder}`);
                      
                      // Wrap with DevWrapper including order
                      const orderAttr = `order={${componentOrder}}`;
                      componentOrder++;
                      
                      if (closing === '/>') {
                        return `<DevWrapper componentName="${componentName}" dataPath="${dataFile}" componentId="${componentId}" ${orderAttr}>
  <${componentName} ${props}/>
</DevWrapper>`;
                      } else {
                        const innerContent = closing.substring(1, closing.lastIndexOf(`</${componentName}>`));
                        return `<DevWrapper componentName="${componentName}" dataPath="${dataFile}" componentId="${componentId}" ${orderAttr}>
  <${componentName} ${props}>${innerContent}</${componentName}>
</DevWrapper>`;
                      }
                    }
                    
                    return match;
                  });
                  
                  if (needsImport) {
                    console.log(`  -> Wrapped components: ${wrappedComponents.join(', ')}`);
                    
                    // Determine correct import path based on file location
                    const isLayoutFile = id.endsWith('/layout.astro');
                    const importPath = isLayoutFile 
                      ? '../../shared/components/Dev/DevWrapper.astro'
                      : '../../../shared/components/Dev/DevWrapper.astro';
                    
                    // Add DevWrapper import at the top of the frontmatter (after the opening ---)
                    const importStatement = `import DevWrapper from '${importPath}';`;
                    const modifiedFrontmatter = frontmatter.replace(
                      /^---\n/,
                      `---\n${importStatement}\n`
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