import React, { useState, useEffect } from 'react';

interface TechSectionProps {
  techSectionRef: React.RefObject<HTMLDivElement | null>;
  cardPositions: Record<number, { x: number; y: number }>;
  dragState: {
    isDragging: boolean;
    cardId: number | null;
    cardType?: 'stack' | 'tech' | 'feature' | 'testimonial' | null;
  };
  handleMouseDown: (e: React.MouseEvent, cardId: number, cardType: 'stack' | 'tech' | 'feature' | 'testimonial', cardIndex?: number) => void;
}

const TechSection: React.FC<TechSectionProps> = ({
  techSectionRef,
  cardPositions,
  dragState,
  handleMouseDown
}) => {
  const [techCardsVisible, setTechCardsVisible] = useState<boolean[]>([false, false, false]);

  // Set up Intersection Observer for animated cards
  useEffect(() => {
    // Initially hide all cards
    setTechCardsVisible([false, false, false]);

    // Create observer for the tech cards section
    const observerOptions = {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 0.2, // Trigger when 20% of the element is visible
    };

    // Observer for tech cards
    const techObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Stagger the appearance of each card
        setTimeout(() => setTechCardsVisible([true, false, false]), 0);
        setTimeout(() => setTechCardsVisible([true, true, false]), 300);
        setTimeout(() => setTechCardsVisible([true, true, true]), 600);

        // Unobserve after animation is triggered
        if (techSectionRef.current) {
          techObserver.unobserve(techSectionRef.current);
        }
      }
    }, observerOptions);

    // Store ref in variable to use in cleanup
    const techSection = techSectionRef.current;

    // Start observing
    if (techSection) {
      techObserver.observe(techSection);
    }

    // Clean up
    return () => {
      if (techSection) techObserver.unobserve(techSection);
    };
  }, [techSectionRef]);

  return (
    <div className="bg-gray-900 py-24" ref={techSectionRef}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-100">Why are we better?</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our innovative card stacking system provides an intuitive and engaging way to present information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Card 1 */}
          <div
            className={`card bg-gray-800 rounded-lg shadow-xl transition-all duration-700 transform overflow-hidden ${
              techCardsVisible[0] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
            style={{
              ...cardPositions[1000] && {
                transform: `translate(${cardPositions[1000].x}px, ${cardPositions[1000].y}px)`,
                position: 'relative',
                zIndex: dragState.cardId === 1000 ? 999 : 1,
                transition: dragState.isDragging && dragState.cardId === 1000 ? 'none' : 'all 0.7s ease-out'
              }
            }}
          >
            {/* Mac-style title bar */}
            <div 
              className="bg-gradient-to-b from-gray-700 to-gray-800 px-4 py-2 flex items-center border-b border-gray-600" 
              style={{ cursor: 'grab', userSelect: 'none' }}
              onMouseDown={(e) => handleMouseDown(e, 1000, 'tech', 0)}
            >
              {/* Mac window buttons */}
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 bg-red-500 rounded-full border border-red-600"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full border border-yellow-600"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full border border-green-600"></div>
              </div>
              <h3 className="text-sm font-medium text-gray-200 flex-1 text-center">Drag & Drop</h3>
              <div className="w-16"></div> {/* Spacer for centering */}
            </div>
            {/* Card content */}
            <div className="p-6 bg-gray-900">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-900 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-100">Drag & Drop</h4>
              </div>
              <p className="text-gray-400">
                Cards can be dragged and repositioned, allowing for a customizable and interactive user experience.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className={`card bg-gray-800 rounded-lg shadow-xl transition-all duration-700 transform overflow-hidden ${
              techCardsVisible[1] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
            style={{
              transitionDelay: '0.2s',
              ...cardPositions[1001] && {
                transform: `translate(${cardPositions[1001].x}px, ${cardPositions[1001].y}px)`,
                position: 'relative',
                zIndex: dragState.cardId === 1001 ? 999 : 1,
                transition: dragState.isDragging && dragState.cardId === 1001 ? 'none' : 'all 0.7s ease-out'
              }
            }}
          >
            {/* Mac-style title bar */}
            <div 
              className="bg-gradient-to-b from-gray-700 to-gray-800 px-4 py-2 flex items-center border-b border-gray-600" 
              style={{ cursor: 'grab', userSelect: 'none' }}
              onMouseDown={(e) => handleMouseDown(e, 1001, 'tech', 1)}
            >
              {/* Mac window buttons */}
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 bg-red-500 rounded-full border border-red-600"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full border border-yellow-600"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full border border-green-600"></div>
              </div>
              <h3 className="text-sm font-medium text-gray-200 flex-1 text-center">Scroll Animation</h3>
              <div className="w-16"></div> {/* Spacer for centering */}
            </div>
            {/* Card content */}
            <div className="p-6 bg-gray-900">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-900 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-100">Scroll Animation</h4>
              </div>
              <p className="text-gray-400">
                Cards animate and stack as you scroll, creating a visually engaging experience that guides users through content.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div
            className={`card bg-gray-800 rounded-lg shadow-xl transition-all duration-700 transform overflow-hidden ${
              techCardsVisible[2] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
            style={{
              transitionDelay: '0.4s',
              ...cardPositions[1002] && {
                transform: `translate(${cardPositions[1002].x}px, ${cardPositions[1002].y}px)`,
                position: 'relative',
                zIndex: dragState.cardId === 1002 ? 999 : 1,
                transition: dragState.isDragging && dragState.cardId === 1002 ? 'none' : 'all 0.7s ease-out'
              }
            }}
          >
            {/* Mac-style title bar */}
            <div 
              className="bg-gradient-to-b from-gray-700 to-gray-800 px-4 py-2 flex items-center border-b border-gray-600" 
              style={{ cursor: 'grab', userSelect: 'none' }}
              onMouseDown={(e) => handleMouseDown(e, 1002, 'tech', 2)}
            >
              {/* Mac window buttons */}
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 bg-red-500 rounded-full border border-red-600"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full border border-yellow-600"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full border border-green-600"></div>
              </div>
              <h3 className="text-sm font-medium text-gray-200 flex-1 text-center">Responsive Design</h3>
              <div className="w-16"></div> {/* Spacer for centering */}
            </div>
            {/* Card content */}
            <div className="p-6 bg-gray-900">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-900 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-100">Responsive Design</h4>
              </div>
              <p className="text-gray-400">
                Cards adapt to any screen size, ensuring a consistent experience across desktop and mobile devices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechSection;