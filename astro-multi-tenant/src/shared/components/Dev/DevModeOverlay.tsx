import React, { useEffect, useState, useRef } from 'react';
import ComponentOverlay from './ComponentOverlay';
import JSONEditorModal from './JSONEditorModal';
import './DevModeOverlay.css';

interface ComponentInfo {
  id: string;
  name: string;
  dataPath?: string;
  element: HTMLElement;
  isReusable: boolean;
  props?: any;
}

const DevModeOverlay: React.FC = () => {
  const [components, setComponents] = useState<Map<string, ComponentInfo>>(new Map());
  const [editingComponent, setEditingComponent] = useState<ComponentInfo | null>(null);
  const [jsonEditorOpen, setJsonEditorOpen] = useState(false);
  const observerRef = useRef<MutationObserver | null>(null);

  // Add a visible indicator that the overlay is loaded
  useEffect(() => {
    console.log('[DevModeOverlay] Component mounted!');
    console.log('[DevModeOverlay] Environment:', { 
      isDev: import.meta.env.DEV,
      mode: import.meta.env.MODE 
    });
  }, []);

  useEffect(() => {
    console.log('[DevModeOverlay] Initializing...');
    
    // Function to scan for components with data attributes
    const scanForComponents = () => {
      console.log('[DevModeOverlay] Scanning for components...');
      const componentElements = document.querySelectorAll('[data-component-name]');
      const newComponents = new Map<string, ComponentInfo>();

      console.log(`[DevModeOverlay] Found ${componentElements.length} components`);
      
      componentElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          const id = element.getAttribute('data-component-id') || `comp-${Date.now()}-${Math.random()}`;
          const name = element.getAttribute('data-component-name') || 'Unknown Component';
          const dataPath = element.getAttribute('data-component-path') || undefined;
          const propsStr = element.getAttribute('data-component-props');
          
          console.log(`[DevModeOverlay] Processing component: ${name}`);
          
          let props = {};
          if (propsStr) {
            try {
              props = JSON.parse(propsStr);
            } catch (e) {
              console.error('Failed to parse component props:', e);
            }
          }

          newComponents.set(id, {
            id,
            name,
            dataPath,
            element,
            isReusable: false,
            props
          });
        }
      });

      console.log(`[DevModeOverlay] Registered ${newComponents.size} components`);
      setComponents(newComponents);
    };

    // Initial scan
    scanForComponents();

    // Set up MutationObserver to watch for new components
    observerRef.current = new MutationObserver((mutations) => {
      let shouldRescan = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement && 
                (node.hasAttribute('data-component-name') || 
                 node.querySelector('[data-component-name]'))) {
              shouldRescan = true;
            }
          });
        }
        
        if (mutation.type === 'attributes' && 
            mutation.attributeName?.startsWith('data-component-')) {
          shouldRescan = true;
        }
      });

      if (shouldRescan) {
        scanForComponents();
      }
    });

    // Start observing
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-component-name', 'data-component-id', 'data-component-path', 'data-component-props']
    });

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleToggleReusable = (componentId: string) => {
    setComponents(prev => {
      const newMap = new Map(prev);
      const component = newMap.get(componentId);
      if (component) {
        component.isReusable = !component.isReusable;
        newMap.set(componentId, { ...component });
      }
      return newMap;
    });
  };

  const handleEditJson = async (component: ComponentInfo) => {
    // Try to load the actual JSON data
    if (component.dataPath) {
      try {
        // Extract site from hostname (e.g., prestongarrison.localhost -> prestongarrison.com)
        let site = window.location.hostname;
        if (site.includes('.localhost')) {
          site = site.replace('.localhost', '.com');
        } else if (site === 'localhost' || site === '127.0.0.1') {
          site = 'prestongarrison.com'; // Default for direct localhost access
        }
        
        // Check if dataPath includes array index notation
        const arrayMatch = component.dataPath.match(/^(.+\.json)\[(\d+)\]$/);
        let pathToLoad = component.dataPath;
        let arrayIndex = -1;
        
        if (arrayMatch) {
          pathToLoad = arrayMatch[1]; // e.g., "projects-items.json"
          arrayIndex = parseInt(arrayMatch[2]); // e.g., 0
        }
        
        // Use the Go API server to fetch the JSON data
        // API URL from environment or fallback to configured values
        const apiBase = import.meta.env.PUBLIC_API_URL || 
                       (import.meta.env.DEV 
                         ? `http://localhost:${import.meta.env.PUBLIC_DEV_API_PORT || '3001'}` 
                         : '');
        
        const response = await fetch(`${apiBase}/api/component-data?path=${pathToLoad}&site=${site}`);
        if (response.ok) {
          const data = await response.json();
          // If it's an array access, get the specific item
          if (arrayIndex >= 0 && Array.isArray(data)) {
            component.props = data[arrayIndex] || {};
          } else {
            component.props = data;
          }
        } else {
          console.error('Failed to load JSON data');
          component.props = {};
        }
      } catch (error) {
        console.error('Failed to load JSON data:', error);
        component.props = {};
      }
    }
    
    setEditingComponent(component);
    setJsonEditorOpen(true);
  };

  const handleSaveJson = async (componentId: string, newData: any) => {
    const component = components.get(componentId);
    if (!component || !component.dataPath) return;

    try {
      // Send update to Go API server
      const apiBase = import.meta.env.PUBLIC_API_URL || 
                     (import.meta.env.DEV 
                       ? `http://localhost:${import.meta.env.PUBLIC_DEV_API_PORT || '3001'}` 
                       : '');
      
      // Extract site from hostname (e.g., prestongarrison.localhost -> prestongarrison.com)
      let site = window.location.hostname;
      if (site.includes('.localhost')) {
        site = site.replace('.localhost', '.com');
      } else if (site === 'localhost' || site === '127.0.0.1') {
        site = 'prestongarrison.com'; // Default for direct localhost access
      }
      
      const response = await fetch(`${apiBase}/api/component-data`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: component.dataPath,
          site: site,
          data: newData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update component data');
      }

      // Update local state
      setComponents(prev => {
        const newMap = new Map(prev);
        const comp = newMap.get(componentId);
        if (comp) {
          comp.props = newData;
          newMap.set(componentId, { ...comp });
        }
        return newMap;
      });

      // Trigger page reload to see changes (HMR should handle this in dev)
      window.location.reload();
    } catch (error) {
      console.error('Error saving JSON:', error);
      alert('Failed to save changes. Check console for details.');
    }
  };

  return (
    <>
      {/* Debug indicator */}
      {import.meta.env.DEV && (
        <div 
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'rgba(59, 130, 246, 0.9)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 99999,
            pointerEvents: 'none'
          }}
        >
          Dev Mode: {components.size} components tracked
        </div>
      )}
      
      {Array.from(components.values()).map((component) => (
        <ComponentOverlay
          key={component.id}
          component={component}
          onToggleReusable={() => handleToggleReusable(component.id)}
          onEditJson={() => handleEditJson(component)}
        />
      ))}
      
      {jsonEditorOpen && editingComponent && (
        <JSONEditorModal
          component={editingComponent}
          isOpen={jsonEditorOpen}
          onClose={() => {
            setJsonEditorOpen(false);
            setEditingComponent(null);
          }}
          onSave={(data) => handleSaveJson(editingComponent.id, data)}
        />
      )}
    </>
  );
};

export default DevModeOverlay;