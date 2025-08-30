import React, { useRef } from 'react';
import { BaseComponentProps } from '../../types';

export interface DraggableCardProps extends BaseComponentProps {
  title: string;
  style?: React.CSSProperties;
  onDragStart?: (e: React.MouseEvent) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  cardId: string;
  theme?: 'light' | 'dark';
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  title,
  children,
  className = '',
  style = {},
  onDragStart,
  onDragEnd,
  isDragging = false,
  cardId,
  theme = 'light'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  // Generate a unique ID for this card instance
  const uniqueId = useRef(`card-${cardId || Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  const cardClasses = isDark
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';
  
  const titleBarClasses = isDark
    ? 'bg-gradient-to-b from-gray-700 to-gray-800 border-gray-600'
    : 'bg-gradient-to-b from-gray-300 to-gray-200 border-gray-300';
  
  const titleTextClasses = isDark ? 'text-gray-200' : 'text-gray-700';
  
  const contentClasses = isDark ? 'bg-gray-900' : 'bg-gray-50';

  return (
    <div
      ref={cardRef}
      className={`card rounded-lg shadow-lg overflow-hidden border ${cardClasses} ${className}`}
      style={{
        ...style,
        cursor: isDragging ? 'grabbing' : 'auto',
        zIndex: isDragging ? 999 : style.zIndex || 'auto',
        boxShadow: isDragging 
          ? '0 8px 24px rgba(0, 0, 0, 0.2)' 
          : style.boxShadow || '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
      data-card-id={uniqueId.current}
    >
      {/* Mac-style title bar */}
      <div 
        className={`px-4 py-2 flex items-center border-b ${titleBarClasses}`}
        style={{ cursor: 'grab', userSelect: 'none' }}
        onMouseDown={onDragStart}
        onMouseUp={onDragEnd}
      >
        {/* Mac window buttons */}
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 bg-red-500 rounded-full border border-red-600"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full border border-yellow-600"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full border border-green-600"></div>
        </div>
        <h3 className={`text-sm font-medium flex-1 text-center ${titleTextClasses}`}>{title}</h3>
        <div className="w-16"></div> {/* Spacer for centering */}
      </div>
      
      {/* Card content */}
      <div className={`p-6 ${contentClasses}`}>
        {children}
      </div>
    </div>
  );
};

export default DraggableCard;