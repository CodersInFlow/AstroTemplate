import React from 'react';
import { Category } from '../../types';
import { formatDate } from '../../utils/dateFormat';

interface BlogPostHeaderProps {
  title: string;
  category?: Category;
  publishedAt?: string | Date;
  readingTime?: string;
  onCategoryClick?: (category: Category) => void;
}

export const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({
  title,
  category,
  publishedAt,
  readingTime,
  onCategoryClick,
}) => {
  return (
    <header className="blog-post-header">
      <div className="blog-post-meta">
        {category && (
          <span
            className="blog-post-category"
            onClick={() => onCategoryClick?.(category)}
            style={{ 
              backgroundColor: category.color || '#007bff',
              cursor: onCategoryClick ? 'pointer' : 'default' 
            }}
          >
            {category.name}
          </span>
        )}
        
        {publishedAt && (
          <time className="blog-post-date">
            {formatDate(publishedAt)}
          </time>
        )}
        
        {readingTime && (
          <span className="blog-post-reading-time">
            {readingTime}
          </span>
        )}
      </div>
      
      <h1 className="blog-post-title">{title}</h1>
    </header>
  );
};