import React, { useEffect, useRef, useState } from 'react';

interface TitledFeatureProps {
  title: string;
  heading: string;
  paragraphs: string[];
  layout?: 'left' | 'right';
  sectionNumber: number;
}

const TitledFeature: React.FC<TitledFeatureProps> = ({ 
  title, 
  heading, 
  paragraphs, 
  layout = 'left',
  sectionNumber 
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const titlePositionRef = useRef(0);

  // Background gradient variations based on section number
  const getBgGradient = () => {
    const gradients = [
      'bg-gradient-to-br from-[#0a0e27] to-[#0f1429]',
      'bg-gradient-to-br from-[#0f1429] to-[#151935]',
      'bg-gradient-to-br from-[#151935] to-[#0a0e27]',
      'bg-gradient-to-br from-[#0a0e27] to-[#1a1f3a]'
    ];
    return gradients[sectionNumber % gradients.length];
  };

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      });
    }, observerOptions);

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Title animation based on scroll
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updateTitlePosition = () => {
      if (!sectionRef.current || !titleTextRef.current || !contentRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const contentHeight = contentRef.current.offsetHeight;
      const titleHeight = titleTextRef.current.offsetHeight;
      
      // Calculate scroll progress
      let scrollProgress = 0;
      
      if (rect.top >= 0) {
        scrollProgress = Math.max(0, Math.min(1, 1 - (rect.top / window.innerHeight)));
      } else {
        const distancePastTop = Math.abs(rect.top);
        scrollProgress = Math.min(1, (window.innerHeight + distancePastTop) / rect.height);
      }
      
      // Calculate target Y position
      const startY = contentHeight - titleHeight;
      const targetY = startY - (scrollProgress * startY);
      
      // Smooth interpolation
      const smoothY = lerp(titlePositionRef.current, targetY, 0.1);
      titlePositionRef.current = smoothY;
      
      // Apply transform
      if (titleTextRef.current) {
        titleTextRef.current.style.transform = `translate3d(0, ${smoothY}px, 0)`;
      }
      
      // Fade in/out based on visibility
      if (titleRef.current) {
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          titleRef.current.style.opacity = '1';
        } else {
          titleRef.current.style.opacity = '0';
        }
      }
    };

    const handleScroll = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(updateTitlePosition);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Initial positioning
    updateTitlePosition();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const isRightLayout = layout === 'right';

  return (
    <section 
      ref={sectionRef}
      className={`feature-showcase-item min-h-[50vh] flex items-center py-12 px-8 relative ${getBgGradient()} ${isInView ? 'in-view' : ''}`}
    >
      <div className={`feature-container max-w-7xl mx-auto grid gap-16 items-start w-full pt-8 ${
        isRightLayout ? 'lg:grid-cols-[1.5fr_1fr]' : 'lg:grid-cols-[1fr_1.5fr]'
      } grid-cols-1`}>
        <div 
          ref={titleRef}
          className={`feature-title lg:sticky lg:top-8 lg:h-[calc(50vh-4rem)] opacity-0 transition-opacity duration-[800ms] ${
            isRightLayout ? 'lg:order-2' : ''
          }`}
        >
          <div className="relative">
            <h2 
              ref={titleTextRef}
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent will-change-transform mb-4"
              style={{
                transform: 'translateZ(0)',
                WebkitFontSmoothing: 'antialiased',
                backfaceVisibility: 'hidden'
              }}
            >
              {title}
            </h2>
            <a 
              href="#" 
              className="inline-flex items-center gap-2 text-sm md:text-base text-blue-400 hover:text-blue-300 transition-colors group cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                // Add navigation logic here if needed
                console.log('Learn more clicked for:', title);
              }}
            >
              <span className="underline-offset-4 hover:underline">Learn more</span>
              <svg 
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
        
        <div 
          ref={contentRef}
          className={`feature-content opacity-0 translate-x-12 transition-all duration-[800ms] ${
            isRightLayout ? 'lg:order-1' : ''
          } ${isInView ? 'opacity-100 translate-x-0' : ''}`}
        >
          <h3 className="text-2xl md:text-3xl mb-6 text-white font-bold">
            {heading}
          </h3>
          {paragraphs.map((paragraph, index) => {
            // Parse for strong tags
            const parts = paragraph.split(/(\*\*.*?\*\*)/g);
            return (
              <p key={index} className="text-lg md:text-xl leading-relaxed text-gray-400 mb-6">
                {parts.map((part, partIndex) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                      <strong key={partIndex} className="text-gray-300 font-semibold">
                        {part.slice(2, -2)}
                      </strong>
                    );
                  }
                  return part;
                })}
              </p>
            );
          })}
        </div>
      </div>

      {/* Visual separator */}
      <div className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20" />

      <style>{`
        .feature-showcase-item.in-view .feature-title {
          opacity: 1;
        }

        .feature-showcase-item.in-view .feature-content {
          opacity: 1;
          transform: translateX(0);
        }

        /* Mobile responsive adjustments */
        @media (max-width: 1024px) {
          .feature-title {
            position: relative !important;
            height: auto !important;
            top: auto !important;
            margin-bottom: 2rem;
          }

          .feature-title h2 {
            position: relative !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default TitledFeature;