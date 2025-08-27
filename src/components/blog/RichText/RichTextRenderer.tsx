import React from 'react';
import { RichTextRendererProps } from '../../types';

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  content,
  format,
  onImageClick,
  className = '',
}) => {
  // For now, we'll handle HTML format and provide placeholders for others
  if (format === 'html') {
    return (
      <div 
        className={`rich-text-content ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.tagName === 'IMG' && onImageClick) {
            const src = (target as HTMLImageElement).src;
            onImageClick(src);
          }
        }}
      />
    );
  }
  
  // Placeholder for TipTap format
  if (format === 'tiptap') {
    // This would be implemented with the actual TipTap renderer
    return (
      <div className={`rich-text-content ${className}`}>
        <p>TipTap content rendering to be implemented</p>
        <pre>{JSON.stringify(content, null, 2)}</pre>
      </div>
    );
  }
  
  // Placeholder for Lexical format
  if (format === 'lexical') {
    return (
      <div className={`rich-text-content ${className}`}>
        <p>Lexical content rendering to be implemented</p>
        <pre>{JSON.stringify(content, null, 2)}</pre>
      </div>
    );
  }
  
  return <div className={`rich-text-content ${className}`}>Unsupported format: {format}</div>;
};