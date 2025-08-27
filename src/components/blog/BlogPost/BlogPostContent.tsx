import React from 'react';
import { RichTextRenderer } from '../RichText/RichTextRenderer';

interface BlogPostContentProps {
  content: any;
  format?: 'html' | 'tiptap' | 'lexical' | 'markdown';
  onImageClick?: (src: string) => void;
}

export const BlogPostContent: React.FC<BlogPostContentProps> = ({
  content,
  format = 'html',
  onImageClick,
}) => {
  return (
    <div className="blog-post-content">
      <RichTextRenderer
        content={content}
        format={format}
        onImageClick={onImageClick}
      />
    </div>
  );
};