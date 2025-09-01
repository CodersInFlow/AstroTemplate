// Vite plugin to automatically wrap components with DevWrapper in development
export function devWrapperPlugin() {
  return {
    name: 'dev-wrapper',
    enforce: 'pre',
    transform(code, id) {
      // Only process in development
      if (process.env.NODE_ENV === 'production') {
        return code;
      }

      // Only process Astro files in the sites directory
      if (!id.endsWith('.astro') || !id.includes('/sites/')) {
        return code;
      }

      // Check if DevWrapper is already imported
      const hasDevWrapper = code.includes('DevWrapper');
      if (hasDevWrapper) {
        return code; // Already using DevWrapper, skip
      }

      // List of components to auto-wrap
      const componentsToWrap = [
        'TitleHeader',
        'Hero',
        'ProjectItem',
        'Skills',
        'Contact',
        'Experiences'
      ];

      let modifiedCode = code;
      let needsImport = false;

      // Auto-wrap component usage
      componentsToWrap.forEach(componentName => {
        // Pattern to match component usage like <ComponentName ... />
        const selfClosingPattern = new RegExp(`<(${componentName})(\\s[^>]*)?\\/>`, 'g');
        // Pattern to match component usage like <ComponentName>...</ComponentName>
        const openClosePattern = new RegExp(`<(${componentName})(\\s[^>]*)?>([\\s\\S]*?)<\\/${componentName}>`, 'g');
        
        if (selfClosingPattern.test(code) || openClosePattern.test(code)) {
          needsImport = true;
          
          // Wrap self-closing components
          modifiedCode = modifiedCode.replace(
            selfClosingPattern,
            `<DevWrapper componentName="$1" dataPath="$1.json">
  <$1$2 />
</DevWrapper>`
          );
          
          // Wrap open-close components
          modifiedCode = modifiedCode.replace(
            openClosePattern,
            `<DevWrapper componentName="$1" dataPath="$1.json">
  <$1$2>$3</$1>
</DevWrapper>`
          );
        }
      });

      // Add import if we wrapped anything
      if (needsImport) {
        // Find where imports end (after the --- block)
        const importInsertPoint = modifiedCode.indexOf('---', 3);
        if (importInsertPoint > -1) {
          const beforeImport = modifiedCode.slice(0, importInsertPoint);
          const afterImport = modifiedCode.slice(importInsertPoint);
          modifiedCode = beforeImport + 
            `import DevWrapper from '../../../shared/components/Dev/DevWrapper.astro';\n` +
            afterImport;
        }
      }

      return modifiedCode;
    }
  };
}