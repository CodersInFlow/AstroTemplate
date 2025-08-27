import React from 'react';
import { BlogPostProps } from '../../types';
import { BlogPostHeader } from './BlogPostHeader';
import { BlogPostContent } from './BlogPostContent';
import { AuthorInfo } from './AuthorInfo';
import { TableOfContents } from './TableOfContents';
import { generateTableOfContents } from '../../utils/tableOfContents';
import { getReadingTime, formatReadingTime } from '../../utils/readingTime';

export const BlogPost: React.FC<BlogPostProps> = ({
  post,
  showTableOfContents = true,
  showAuthor = true,
  showRelatedPosts = false,
  relatedPosts = [],
  onImageClick,
  onCategoryClick,
  className = '',
}) => {
  // Calculate reading time if not provided
  const readingTime = post.readingTime || getReadingTime(
    post.content,
    post.contentFormat || 'html'
  );
  
  // Generate table of contents
  const tableOfContents = showTableOfContents
    ? generateTableOfContents(post.content, post.contentFormat || 'html')
    : [];
  
  return (
    <article className={`blog-post ${className}`}>
      <BlogPostHeader
        title={post.title}
        category={post.category}
        publishedAt={post.publishedAt}
        readingTime={formatReadingTime(readingTime)}
        onCategoryClick={onCategoryClick}
      />
      
      <div className="blog-post-layout">
        {showTableOfContents && tableOfContents.length > 0 && (
          <aside className="blog-post-sidebar">
            <TableOfContents items={tableOfContents} />
          </aside>
        )}
        
        <div className="blog-post-main">
          {post.featuredImage && (
            <div className="blog-post-featured-image">
              <img
                src={post.featuredImage}
                alt={post.title}
                onClick={() => onImageClick?.(post.featuredImage!)}
              />
            </div>
          )}
          
          <BlogPostContent
            content={post.content}
            format={post.contentFormat || 'html'}
            onImageClick={onImageClick}
          />
          
          {showAuthor && post.author && (
            <AuthorInfo author={post.author} />
          )}
          
          {showRelatedPosts && relatedPosts.length > 0 && (
            <div className="blog-post-related">
              <h3>Related Posts</h3>
              <div className="related-posts-grid">
                {relatedPosts.map((relatedPost) => (
                  <div key={relatedPost.id} className="related-post-card">
                    <h4>{relatedPost.title}</h4>
                    <p>{relatedPost.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};