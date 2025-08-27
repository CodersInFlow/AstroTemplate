import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import 'highlight.js/styles/github-dark.css';

// Create lowlight instance with common languages
const lowlight = createLowlight(common);

interface BlogPostViewerProps {
  post: {
    id: string;
    title: string;
    content: string;
    category_data?: { name: string; slug: string } | null;
    coverImage?: string;
    author_data: {
      name: string;
      email: string;
    } | null;
    readingTime: number;
    createdAt: string;
  };
}

export default function BlogPostViewer({ post }: BlogPostViewerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg my-4',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'auto',
        HTMLAttributes: {
          class: 'hljs not-prose bg-[#0d1117] rounded-lg p-4 overflow-x-auto text-sm leading-relaxed',
          spellcheck: 'false',
        },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-blue-400 hover:text-blue-300 underline',
          rel: 'noopener noreferrer',
          target: '_blank'
        },
      }),
    ],
    content: isMounted && post?.content ? (() => {
      try {
        if (post.content && post.content.trim()) {
          return typeof post.content === 'string' ? JSON.parse(post.content) : post.content;
        }
        return '';
      } catch (e) {
        console.error('Failed to parse content:', e);
        return '';
      }
    })() : '',
    editable: false, // Read-only mode
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none w-full focus:outline-none',
      },
    },
  }, [post?.content, isMounted]);

  if (!isMounted || !editor) {
    return (
      <div className="min-h-[400px] p-4 text-gray-400">
        Loading...
      </div>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="w-full max-w-none mx-auto px-4 py-8">
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        <article className="col-span-3 min-w-0 w-full">
          {/* Post Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 text-blog-text-secondary text-sm mb-2">
              <span>{post.category_data?.name || 'General'}</span>
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
              <span>•</span>
              <span>{post.readingTime} min read</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 text-blog-text-primary">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blog-author-avatar-bg text-blog-author-avatar-text flex items-center justify-center">
                {post.author_data?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <div className="font-medium text-blog-text-primary">
                  {post.author_data?.name || 'Anonymous'}
                </div>
                <div className="text-sm text-blog-text-muted">
                  {post.author_data?.email || ''}
                </div>
              </div>
            </div>
          </header>

          {/* Post Content */}
          <div className="prose prose-invert max-w-none">
            <EditorContent editor={editor} />
          </div>
        </article>
        
        {/* Table of Contents Sidebar could go here if needed */}
      </div>
    </div>
  );
}