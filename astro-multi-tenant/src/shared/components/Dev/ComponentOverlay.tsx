import React, { useEffect, useState, useRef } from 'react';

interface ComponentInfo {
  id: string;
  name: string;
  dataPath?: string;
  element: HTMLElement;
  isReusable: boolean;
  props?: any;
}

interface ComponentOverlayProps {
  component: ComponentInfo;
  onToggleReusable: () => void;
  onEditJson: () => void;
}

const ComponentOverlay: React.FC<ComponentOverlayProps> = ({
  component,
  onToggleReusable,
  onEditJson
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      const rect = component.element.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
      });
    };

    // Initial position
    updatePosition();

    // Update on scroll and resize
    const handleUpdate = () => updatePosition();
    window.addEventListener('scroll', handleUpdate);
    window.addEventListener('resize', handleUpdate);

    // Highlight component on hover
    const handleMouseEnter = () => {
      component.element.style.outline = '2px dashed rgba(59, 130, 246, 0.5)';
      component.element.style.outlineOffset = '2px';
    };

    const handleMouseLeave = () => {
      component.element.style.outline = '';
      component.element.style.outlineOffset = '';
    };

    // Add hover listeners to component element
    component.element.addEventListener('mouseenter', handleMouseEnter);
    component.element.addEventListener('mouseleave', handleMouseLeave);

    // Observe element position changes
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(component.element);

    return () => {
      window.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('resize', handleUpdate);
      component.element.removeEventListener('mouseenter', handleMouseEnter);
      component.element.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
      // Clean up outline
      component.element.style.outline = '';
      component.element.style.outlineOffset = '';
    };
  }, [component.element]);

  return (
    <div
      ref={overlayRef}
      className="dev-component-overlay"
      style={{
        position: 'absolute',
        top: `${position.top - 30}px`,
        left: `${position.left}px`,
        zIndex: 9999,
        pointerEvents: 'auto'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`overlay-content ${isHovered ? 'expanded' : ''}`}
        style={{
          background: 'rgba(17, 24, 39, 0.95)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px',
          fontFamily: 'monospace',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(59, 130, 246, 0.5)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease'
        }}
      >
        <span 
          className="component-name"
          style={{
            fontWeight: 'bold',
            color: '#60a5fa'
          }}
        >
          {component.name}
        </span>
        
        <div 
          className="overlay-controls"
          style={{
            display: isHovered ? 'flex' : 'none',
            alignItems: 'center',
            gap: '6px',
            borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
            paddingLeft: '6px',
            marginLeft: '2px'
          }}
        >
          <label 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <input
              type="checkbox"
              checked={component.isReusable}
              onChange={onToggleReusable}
              style={{
                cursor: 'pointer',
                width: '14px',
                height: '14px'
              }}
            />
            <span style={{ fontSize: '11px' }}>Reuse</span>
          </label>
          
          {component.dataPath && (
            <button
              onClick={onEditJson}
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                color: '#93c5fd',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                e.currentTarget.style.color = '#dbeafe';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                e.currentTarget.style.color = '#93c5fd';
              }}
            >
              Edit JSON
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentOverlay;