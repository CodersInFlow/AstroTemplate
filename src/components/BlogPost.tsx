import { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import RichTextRenderer from './RichTextRenderer';

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

interface BlogPostProps {
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

// Helper to generate heading IDs
function generateHeadingId(text: string, count: number): string {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return count > 1 ? `${base}-${count}` : base;
}

export default function BlogPost({ post }: BlogPostProps) {
  const [toc, setToc] = useState<TableOfContentsItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeHeading, setActiveHeading] = useState<string>('');

  // Generate table of contents from content
  useEffect(() => {
    if (post?.content) {
      try {
        const contentJson = typeof post.content === 'string' 
          ? JSON.parse(post.content) 
          : post.content;

        const tocItems: TableOfContentsItem[] = [];
        const headingCounts: Record<string, number> = {};
        
        const processNode = (node: any) => {
          if (node.type === 'heading' && node.attrs?.level) {
            const text = node.content?.[0]?.text || '';
            
            headingCounts[text] = (headingCounts[text] || 0) + 1;
            const id = generateHeadingId(text, headingCounts[text]);
            
            tocItems.push({
              id,
              text,
              level: node.attrs.level
            });
          }
          
          if (node.content) {
            node.content.forEach(processNode);
          }
        };

        contentJson.content?.forEach(processNode);
        setToc(tocItems);

      } catch (error) {
        console.error('Error generating table of contents:', error);
      }
    }
  }, [post?.content]);

  // Track active heading for TOC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    const headings = document.querySelectorAll('h1[id], h2[id], h3[id]');
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, [toc]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleImageClick = useCallback((src: string) => {
    setSelectedImage(src);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  return (
    <div className="w-full max-w-none mx-auto px-4 py-8">
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Main Content */}
        <article className="col-span-3 min-w-0 w-full">
          {post.coverImage && (
            <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden">
              <button 
                onClick={() => handleImageClick(post.coverImage!)}
                className="w-full h-full cursor-zoom-in"
              >
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </button>
            </div>
          )}

          <header className="mb-8">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <span>{post.category_data?.name || 'Uncategorized'}</span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{post.readingTime} min read</span>
            </div>

            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                {post.author_data?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <div className="font-medium">{post.author_data?.name || 'Anonymous'}</div>
                <div className="text-sm text-gray-400">{post.author_data?.email || ''}</div>
              </div>
            </div>
          </header>

          <RichTextRenderer 
            content={post.content}
            onImageClick={handleImageClick}
            generateHeadingId={generateHeadingId}
          />
        </article>

        {/* Table of Contents Sidebar */}
        {toc.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <nav className="space-y-2">
                {toc.map((item) => (
                  <button
                    key={`${item.id}-${item.text}`}
                    onClick={() => scrollToSection(item.id)}
                    className={`block text-left w-full text-sm transition-colors ${
                      activeHeading === item.id
                        ? 'text-blue-400 font-medium'
                        : 'text-gray-400 hover:text-white'
                    } ${
                      item.level === 2 ? 'pl-4' : item.level === 3 ? 'pl-8' : ''
                    }`}
                  >
                    {item.text}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close image"
            >
              <X size={32} />
            </button>
            <img
              src={selectedImage}
              alt="Full size image"
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}