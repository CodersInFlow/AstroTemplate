import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Link from '@tiptap/extension-link';
import { common, createLowlight } from 'lowlight';
import { useEffect, useState, useCallback } from 'react';
import { Bold, Italic, List, ListOrdered, ImageIcon, Code, Link2, Quote } from 'lucide-react';

// Import languages for syntax highlighting
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';

// Create lowlight instance
const lowlight = createLowlight(common);
lowlight.register('typescript', typescript);
lowlight.register('javascript', javascript);
lowlight.register('python', python);
lowlight.register('go', go);
lowlight.register('rust', rust);
lowlight.register('bash', bash);
lowlight.register('json', json);
lowlight.register('html', html);
lowlight.register('css', css);

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg my-4',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: null,
        HTMLAttributes: {
          class: 'hljs bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-400 hover:text-blue-300 underline',
        },
      }),
    ],
    content: isMounted ? (content ? JSON.parse(content) : '') : '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert min-h-[400px] max-w-none w-full p-4 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(JSON.stringify(json));
    },
    immediatelyRender: false,
    placeholder,
  });

  const addImage = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${import.meta.env.PUBLIC_API_URL || 'http://localhost:8749'}/api/upload`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const { url } = await response.json();
        editor?.chain().focus().setImage({ src: url }).run();
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image');
      } finally {
        setUploading(false);
      }
    };

    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().unsetLink().run();
      return;
    }

    editor?.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  if (!isMounted || !editor) {
    return (
      <div className="border border-gray-700 rounded-md bg-gray-800 min-h-[400px] p-4">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border border-gray-700 rounded-lg bg-gray-800 overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-gray-700 bg-gray-900 p-2">
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-700 ${editor.isActive('bold') ? 'bg-gray-700' : ''}`}
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-700 ${editor.isActive('italic') ? 'bg-gray-700' : ''}`}
              title="Italic"
            >
              <Italic size={16} />
            </button>
            
            <div className="w-px h-6 bg-gray-700 mx-1" />
            
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`px-2 py-1 rounded hover:bg-gray-700 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-700' : ''}`}
              title="Heading 1"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`px-2 py-1 rounded hover:bg-gray-700 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-700' : ''}`}
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`px-2 py-1 rounded hover:bg-gray-700 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-700' : ''}`}
              title="Heading 3"
            >
              H3
            </button>
            
            <div className="w-px h-6 bg-gray-700 mx-1" />
            
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-gray-700 ${editor.isActive('bulletList') ? 'bg-gray-700' : ''}`}
              title="Bullet List"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-gray-700 ${editor.isActive('orderedList') ? 'bg-gray-700' : ''}`}
              title="Ordered List"
            >
              <ListOrdered size={16} />
            </button>
            
            <div className="w-px h-6 bg-gray-700 mx-1" />
            
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-2 rounded hover:bg-gray-700 ${editor.isActive('codeBlock') ? 'bg-gray-700' : ''}`}
              title="Code Block"
            >
              <Code size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded hover:bg-gray-700 ${editor.isActive('blockquote') ? 'bg-gray-700' : ''}`}
              title="Quote"
            >
              <Quote size={16} />
            </button>
            
            <div className="w-px h-6 bg-gray-700 mx-1" />
            
            <button
              type="button"
              onClick={setLink}
              className="p-2 rounded hover:bg-gray-700"
              title="Add Link"
            >
              <Link2 size={16} />
            </button>
            <button
              type="button"
              onClick={addImage}
              className="p-2 rounded hover:bg-gray-700 relative"
              title="Add Image"
              disabled={uploading}
            >
              <ImageIcon size={16} className={uploading ? 'opacity-50' : ''} />
              {uploading && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs whitespace-nowrap">
                  Uploading...
                </div>
              )}
            </button>
          </div>
        </div>
        
        {/* Editor */}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}