import React from 'react';

interface CustomizableCardProps {
  width?: string | number;
  height?: string | number;
  title: string;
  content: React.ReactNode;
  className?: string;
  draggable?: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

const CustomizableCard: React.FC<CustomizableCardProps> = ({
  width = '100%',
  height = 'auto',
  title,
  content,
  className = '',
  draggable = false,
  onMouseDown,
  style = {}
}) => {
  return (
    <div 
      className={`card bg-gray-800 rounded-lg shadow-xl overflow-hidden ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style
      }}
    >
      {/* Mac-style title bar - dark mode */}
      <div 
        className="bg-gradient-to-b from-gray-700 to-gray-800 px-4 py-2 flex items-center border-b border-gray-600" 
        style={{ 
          cursor: draggable ? 'grab' : 'default', 
          userSelect: 'none' 
        }}
        onMouseDown={draggable ? onMouseDown : undefined}
      >
        {/* Mac window buttons */}
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 bg-red-500 rounded-full border border-red-600"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full border border-yellow-600"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full border border-green-600"></div>
        </div>
        <h3 className="text-sm font-medium text-gray-200 flex-1 text-center">{title}</h3>
        <div className="w-16"></div> {/* Spacer for centering */}
      </div>
      
      {/* Card content */}
      <div className="p-6 bg-gray-900" style={{ height: 'calc(100% - 40px)' }}>
        {content}
      </div>
    </div>
  );
};

export default CustomizableCard;