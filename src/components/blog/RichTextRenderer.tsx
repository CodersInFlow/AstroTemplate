import { useEffect, useRef } from 'react';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github-dark.css';

// Import languages for syntax highlighting
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import java from 'highlight.js/lib/languages/java';
import ruby from 'highlight.js/lib/languages/ruby';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import shell from 'highlight.js/lib/languages/shell';
import plaintext from 'highlight.js/lib/languages/plaintext';
import sql from 'highlight.js/lib/languages/sql';
import yaml from 'highlight.js/lib/languages/yaml';
import markdown from 'highlight.js/lib/languages/markdown';
import php from 'highlight.js/lib/languages/php';
import swift from 'highlight.js/lib/languages/swift';
import kotlin from 'highlight.js/lib/languages/kotlin';
import csharp from 'highlight.js/lib/languages/csharp';

// Register languages
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('java', java);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('c', c);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('plaintext', plaintext);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('php', php);
hljs.registerLanguage('swift', swift);
hljs.registerLanguage('kotlin', kotlin);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('cs', csharp);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('py', python);
hljs.registerLanguage('rb', ruby);
hljs.registerLanguage('sh', shell);

// Configure marked with syntax highlighting
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
}));

interface RichTextRendererProps {
  content: string;
  onImageClick?: (src: string) => void;
  generateHeadingId?: (text: string, count: number) => string;
}

export default function RichTextRenderer({ 
  content, 
  onImageClick,
  generateHeadingId 
}: RichTextRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingCounts = useRef<Record<string, number>>({});

  useEffect(() => {
    // Highlight code blocks after render
    if (containerRef.current) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        containerRef.current?.querySelectorAll('pre code').forEach((block) => {
          // Remove any existing highlighting classes
          block.className = block.className.replace(/hljs/g, '');
          // Re-highlight
          hljs.highlightElement(block as HTMLElement);
        });
      }, 100);

      // Add click handlers to images
      if (onImageClick) {
        containerRef.current.querySelectorAll('img').forEach((img) => {
          img.style.cursor = 'zoom-in';
          img.onclick = () => onImageClick(img.src);
        });
      }
    }
  }, [content, onImageClick]);

  // Parse content - either TipTap JSON or Markdown
  const renderContent = () => {
    // Check if content looks like TipTap JSON
    const trimmedContent = content.trim();
    if (trimmedContent.startsWith('{') && trimmedContent.includes('"type"')) {
      try {
        // Try to parse as JSON (TipTap format)
        const doc = JSON.parse(trimmedContent);
        headingCounts.current = {}; // Reset heading counts
        return renderNode(doc);
      } catch (e) {
        console.error('Failed to parse TipTap JSON:', e);
        // Fallback to markdown
        const htmlContent = marked(content);
        return htmlContent;
      }
    } else {
      // Treat as markdown
      const htmlContent = marked(content);
      return htmlContent;
    }
  };

  const renderNode = (node: any): string => {
    if (!node) return '';

    switch (node.type) {
      case 'doc':
        return node.content?.map(renderNode).join('') || '';

      case 'paragraph':
        const paragraphContent = node.content?.map(renderNode).join('') || '';
        return paragraphContent ? `<p class="mb-4">${paragraphContent}</p>` : '';

      case 'heading':
        const level = node.attrs?.level || 1;
        const headingContent = node.content?.map(renderNode).join('') || '';
        const headingText = headingContent.replace(/<[^>]*>/g, ''); // Strip HTML for ID
        
        let id = '';
        if (generateHeadingId && headingText) {
          headingCounts.current[headingText] = (headingCounts.current[headingText] || 0) + 1;
          id = generateHeadingId(headingText, headingCounts.current[headingText]);
        }
        
        const classes = level === 1 ? 'text-3xl font-bold mb-4 text-white' :
                       level === 2 ? 'text-2xl font-bold mb-3 text-white' :
                       'text-xl font-bold mb-2 text-white';
        
        return `<h${level} ${id ? `id="${id}"` : ''} class="${classes}">${headingContent}</h${level}>`;

      case 'text':
        let textContent = node.text || '';
        if (node.marks) {
          node.marks.forEach((mark: any) => {
            switch (mark.type) {
              case 'bold':
                textContent = `<strong class="font-bold">${textContent}</strong>`;
                break;
              case 'italic':
                textContent = `<em class="italic">${textContent}</em>`;
                break;
              case 'link':
                textContent = `<a href="${mark.attrs.href}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">${textContent}</a>`;
                break;
              case 'code':
                textContent = `<code class="bg-gray-800 px-1 py-0.5 rounded text-sm">${textContent}</code>`;
                break;
            }
          });
        }
        return textContent;

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
        return `<pre class="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-4"><code class="language-${lang} text-sm">${escapeHtml(code)}</code></pre>`;

      case 'blockquote':
        const quoteContent = node.content?.map(renderNode).join('') || '';
        return `<blockquote class="border-l-4 border-gray-600 pl-4 my-4 italic text-gray-400">${quoteContent}</blockquote>`;

      case 'image':
        const { src, alt = '', title = '' } = node.attrs || {};
        return `<img src="${src}" alt="${alt}" title="${title}" class="max-w-full rounded-lg my-4" />`;

      case 'hardBreak':
        return '<br />';

      default:
        // For unknown nodes, try to render their content
        return node.content?.map(renderNode).join('') || '';
    }
  };

  const escapeHtml = (text: string): string => {
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