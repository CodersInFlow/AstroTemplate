"use client";

import { useEffect, useState } from 'react';

interface HeroScrollData {
  title: string;
  subtitle: string;
  finalTitle: string;
  finalSubtitle: string;
  image: string;
}

interface HeroScrollAnimationProps {
  data?: HeroScrollData;
}

const HeroScrollAnimation: React.FC<HeroScrollAnimationProps> = ({ data }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [nextSectionVisible, setNextSectionVisible] = useState(false);

  // Default data if none provided
  const heroData: HeroScrollData = data || {
    title: "AI-Powered Development",
    subtitle: "Build faster with intelligent code assistance",
    finalTitle: "The Future of Coding",
    finalSubtitle: "Experience next-generation development tools",
    image: "/placeholder.png"
  };

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      const windowHeight = window.innerHeight;
      // Keep the animation at 100% after reaching it, but continue tracking scroll
      const scrollPercentage = Math.min((position / windowHeight) * 100, 100);
      setScrollPosition(scrollPercentage);

      // Check if next section is visible
      const firstSection = document.getElementById('next-section');
      if (firstSection) {
        const rect = firstSection.getBoundingClientRect();
        setNextSectionVisible(rect.top < window.innerHeight - 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-[300vh] bg-transparent">
      {/* First section - Initial view */}
      <div className="sticky top-0 h-screen flex items-start pt-96 justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 w-full relative">
          {/* Text content */}
          <div 
            className="text-foreground text-center transition-opacity duration-500"
            style={{
              opacity: scrollPosition < 33 ? 1 : 0
            }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {heroData.title}
            </h1>
            <p className="text-xl md:text-2xl text-foreground-secondary">
              {heroData.subtitle}
            </p>

            {/* Scroll indicator */}
            <div 
              className="absolute bottom-48 left-1/2 -translate-x-1/2 text-center animate-bounce"
              style={{
                opacity: scrollPosition < 10 ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out'
              }}
            >
              <p className="text-foreground-muted mb-2">Scroll Down</p>
              <div className="flex flex-col items-center gap-1">
                <svg 
                  className="w-6 h-6 text-foreground-muted" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                  />
                </svg>
                <svg 
                  className="w-6 h-6 text-foreground-muted" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Image container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative w-full max-w-[900px] transition-all duration-1000"
              style={{
                transform: `scale(${Math.min(1 + scrollPosition / 50, 1.2)})`,
                opacity: Math.max(0, Math.min((scrollPosition - 10) / 50, 1))
              }}
            >
              <img
                src={heroData.image}
                alt="Hero Display"
                className="w-full h-auto object-contain rounded-lg transition-transform duration-1000"
                style={{
                  transform: `translateY(${scrollPosition > 50 ? 0 : 100}px)`,
                }}
              />

              {/* Second scroll indicator - appears with image */}
              <div 
                className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center animate-bounce"
                style={{
                  opacity: scrollPosition > 33 && scrollPosition < 66 ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out'
                }}
              >
                <p className="text-foreground-muted mb-2">Keep Scrolling</p>
                <div className="flex flex-col items-center gap-1">
                  <svg 
                    className="w-6 h-6 text-foreground-muted" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                    />
                  </svg>
                  <svg 
                    className="w-6 h-6 text-foreground-muted" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Final text overlay */}
          <div 
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
            style={{
              opacity: scrollPosition >= 100 ? 1 : 0
            }}
          >
            <div className="text-foreground text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                {heroData.finalTitle}
              </h2>
              <p className="text-lg md:text-xl text-foreground-secondary">
                {heroData.finalSubtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Scrolling indicator */}
      <div 
        className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-xl text-center z-50"
        style={{
          opacity: scrollPosition >= 33 && !nextSectionVisible ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        <div className="flex items-center justify-center gap-4 bg-background/50 backdrop-blur-sm py-2 px-4 rounded-full">
          <svg 
            className="w-8 h-8 text-foreground rotate-180" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
          
          <p className="text-foreground text-lg font-medium">Continue Scrolling</p>
          
          <svg 
            className="w-8 h-8 text-foreground" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HeroScrollAnimation;