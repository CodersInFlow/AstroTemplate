import { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface RichTextRendererProps {
  content: string;
}

export default function RichTextRenderer({ content }: RichTextRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Highlight code blocks after render
    if (containerRef.current) {
      containerRef.current.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [content]);

  // Parse TipTap JSON content to HTML
  const renderContent = () => {
    try {
      const doc = JSON.parse(content);
      return renderNode(doc);
    } catch (e) {
      // If not JSON, return as-is
      return content;
    }
  };

  const renderNode = (node: any): string => {
    if (!node) return '';

    switch (node.type) {
      case 'doc':
        return node.content?.map(renderNode).join('') || '';

      case 'paragraph':
        const paragraphContent = node.content?.map(renderNode).join('') || '';
        return `<p>${paragraphContent}</p>`;

      case 'heading':
        const level = node.attrs?.level || 1;
        const headingContent = node.content?.map(renderNode).join('') || '';
        return `<h${level}>${headingContent}</h${level}>`;

      case 'text':
        let text = node.text || '';
        if (node.marks) {
          node.marks.forEach((mark: any) => {
            switch (mark.type) {
              case 'bold':
                text = `<strong>${text}</strong>`;
                break;
              case 'italic':
                text = `<em>${text}</em>`;
                break;
              case 'link':
                text = `<a href="${mark.attrs.href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
                break;
              case 'code':
                text = `<code>${text}</code>`;
                break;
            }
          });
        }
        return text;

      case 'bulletList':
        const bulletItems = node.content?.map(renderNode).join('') || '';
        return `<ul>${bulletItems}</ul>`;

      case 'orderedList':
        const orderedItems = node.content?.map(renderNode).join('') || '';
        return `<ol>${orderedItems}</ol>`;

      case 'listItem':
        const listContent = node.content?.map(renderNode).join('') || '';
        return `<li>${listContent}</li>`;

      case 'codeBlock':
        const lang = node.attrs?.language || '';
        const code = node.content?.[0]?.text || '';
        return `<pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>`;

      case 'blockquote':
        const quoteContent = node.content?.map(renderNode).join('') || '';
        return `<blockquote>${quoteContent}</blockquote>`;

      case 'image':
        const { src, alt = '', title = '' } = node.attrs || {};
        return `<img src="${src}" alt="${alt}" title="${title}" />`;

      case 'hardBreak':
        return '<br />';

      default:
        // For unknown nodes, try to render their content
        return node.content?.map(renderNode).join('') || '';
    }
  };

  const escapeHtml = (text: string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  return (
    <div 
      ref={containerRef}
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: renderContent() }}
    />
  );
}