import { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { Copy, Check } from 'lucide-react';

interface RichTextRendererProps {
  content: string;
  onImageClick?: (src: string) => void;
  generateHeadingId?: (text: string, count: number) => string;
}

export default function RichTextRendererEnhanced({ 
  content, 
  onImageClick,
  generateHeadingId 
}: RichTextRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const headingCounts = useRef<Record<string, number>>({});

  useEffect(() => {
    if (containerRef.current) {
      // Highlight code blocks
      containerRef.current.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });

      // Add copy buttons to code blocks
      containerRef.current.querySelectorAll('.code-block-wrapper').forEach((wrapper) => {
        const copyButton = wrapper.querySelector('.copy-button') as HTMLButtonElement;
        const codeElement = wrapper.querySelector('code');
        
        if (copyButton && codeElement) {
          copyButton.addEventListener('click', async () => {
            const code = codeElement.textContent || '';
            const blockId = wrapper.getAttribute('data-block-id') || '';
            
            try {
              await navigator.clipboard.writeText(code);
              setCopiedId(blockId);
              setTimeout(() => setCopiedId(null), 2000);
            } catch (err) {
              console.error('Failed to copy:', err);
            }
          });
        }
      });

      // Add click handlers to images
      if (onImageClick) {
        containerRef.current.querySelectorAll('img').forEach((img) => {
          img.style.cursor = 'zoom-in';
          img.addEventListener('click', () => {
            onImageClick(img.src);
          });
        });
      }
    }
  }, [content, onImageClick]);

  // Parse TipTap JSON content to HTML
  const renderContent = () => {
    try {
      const doc = JSON.parse(content);
      headingCounts.current = {}; // Reset counts for each render
      return renderNode(doc);
    } catch (e) {
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
        return paragraphContent ? `<p class="mb-4">${paragraphContent}</p>` : '<p class="mb-4">&nbsp;</p>';

      case 'heading':
        const level = node.attrs?.level || 1;
        const headingText = extractText(node);
        
        if (generateHeadingId && headingText) {
          headingCounts.current[headingText] = (headingCounts.current[headingText] || 0) + 1;
          const id = generateHeadingId(headingText, headingCounts.current[headingText]);
          const headingContent = node.content?.map(renderNode).join('') || '';
          return `<h${level} id="${id}" class="group">${headingContent}<a href="#${id}" class="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">#</a></h${level}>`;
        } else {
          const headingContent = node.content?.map(renderNode).join('') || '';
          return `<h${level}>${headingContent}</h${level}>`;
        }

      case 'text':
        let text = escapeHtml(node.text || '');
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
                text = `<a href="${mark.attrs.href}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">${text}</a>`;
                break;
              case 'code':
                text = `<code class="bg-gray-800 px-1 py-0.5 rounded text-sm">${text}</code>`;
                break;
            }
          });
        }
        return text;

      case 'bulletList':
        const bulletItems = node.content?.map(renderNode).join('') || '';
        return `<ul class="list-disc list-inside mb-4 ml-4">${bulletItems}</ul>`;

      case 'orderedList':
        const orderedItems = node.content?.map(renderNode).join('') || '';
        return `<ol class="list-decimal list-inside mb-4 ml-4">${orderedItems}</ol>`;

      case 'listItem':
        const listContent = node.content?.map(renderNode).join('') || '';
        return `<li class="mb-1">${listContent}</li>`;

      case 'codeBlock':
        const lang = node.attrs?.language || 'plaintext';
        const code = node.content?.[0]?.text || '';
        const blockId = `code-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        return `
          <div class="code-block-wrapper relative group my-4" data-block-id="${blockId}">
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="copy-button p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors" title="Copy code">
                ${copiedId === blockId 
                  ? '<svg class="w-4 h-4"><use href="#check-icon"/></svg>' 
                  : '<svg class="w-4 h-4"><use href="#copy-icon"/></svg>'}
              </button>
            </div>
            <pre class="bg-gray-900 rounded-lg overflow-x-auto"><code class="language-${lang} block p-4">${escapeHtml(code)}</code></pre>
          </div>
        `;

      case 'blockquote':
        const quoteContent = node.content?.map(renderNode).join('') || '';
        return `<blockquote class="border-l-4 border-gray-600 pl-4 italic my-4">${quoteContent}</blockquote>`;

      case 'image':
        const { src, alt = '', title = '' } = node.attrs || {};
        return `<img src="${src}" alt="${alt}" title="${title}" class="max-w-full rounded-lg my-4 cursor-zoom-in hover:opacity-90 transition-opacity" />`;

      case 'hardBreak':
        return '<br />';

      default:
        return node.content?.map(renderNode).join('') || '';
    }
  };

  const extractText = (node: any): string => {
    if (node.text) return node.text;
    if (node.content) {
      return node.content.map(extractText).join('');
    }
    return '';
  };

  const escapeHtml = (text: string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  return (
    <>
      {/* Hidden SVG icons */}
      <svg className="hidden">
        <defs>
          <g id="copy-icon">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="none" stroke="currentColor" strokeWidth="2"/>
          </g>
          <g id="check-icon">
            <polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" strokeWidth="2"/>
          </g>
        </defs>
      </svg>
      
      <div 
        ref={containerRef}
        className="prose prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4 prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-2"
        dangerouslySetInnerHTML={{ __html: renderContent() }}
      />
    </>
  );
}