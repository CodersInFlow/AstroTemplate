import React, { useState, useEffect } from 'react';

const BrowserWidthIndicator: React.FC = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed top-24 right-4 bg-black text-yellow-400 px-4 py-2 rounded-lg shadow-2xl z-[9999] font-mono text-sm font-bold border-2 border-yellow-400">
      Width: {width}px
    </div>
  );
};

export default BrowserWidthIndicator;