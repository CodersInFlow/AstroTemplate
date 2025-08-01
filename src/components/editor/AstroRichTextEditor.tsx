import React, { useEffect, useRef } from 'react';
import RichTextEditor from './RichTextEditor';

interface AstroRichTextEditorProps {
  content: string;
  placeholder?: string;
  inputId?: string;
}

export default function AstroRichTextEditor({ content, placeholder, inputId = 'content' }: AstroRichTextEditorProps) {
  const contentRef = useRef<string>(content || '');

  // Handle onChange by updating both the ref and the DOM
  const handleChange = (newContent: string) => {
    console.log('AstroRichTextEditor onChange:', newContent);
    contentRef.current = newContent;
    
    // Update hidden input
    const hiddenInput = document.getElementById(inputId) as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = newContent;
      console.log('Updated hidden input');
    }
    
    // Update window object as fallback
    if (typeof window !== 'undefined') {
      (window as any).__editorContent = newContent;
      console.log('Updated window.__editorContent');
    }
  };

  // Set initial values on mount
  useEffect(() => {
    if (content) {
      handleChange(content);
    }
  }, []);

  return (
    <RichTextEditor 
      content={content}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
}