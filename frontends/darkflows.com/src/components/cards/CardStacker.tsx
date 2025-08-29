import React, { useState, useRef, useEffect } from 'react';
import { BaseComponentProps } from '../../types';

export interface DragState {
  isDragging: boolean;
  cardId: number | null;
  cardType: 'stack' | 'tech' | 'feature' | 'testimonial' | null;
  cardIndex?: number;
  initialX: number;
  initialY: number;
  offsetX: number;
  offsetY: number;
}

export interface CardStackerProps extends BaseComponentProps {
  sections?: React.ReactNode[];
  theme?: 'light' | 'dark';
  onDragStart?: (cardId: number, cardType: string) => void;
  onDragEnd?: (cardId: number, position: { x: number; y: number }) => void;
}

const CardStacker: React.FC<CardStackerProps> = ({
  sections = [],
  className = '',
  children,
  theme = 'dark',
  onDragStart,
  onDragEnd
}) => {
  // Store custom positions for each card
  const [cardPositions, setCardPositions] = useState<Record<number, { x: number; y: number }>>({});

  // State for drag functionality
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    cardId: null,
    cardType: null,
    initialX: 0,
    initialY: 0,
    offsetX: 0,
    offsetY: 0
  });

  // Handle mouse down event to start dragging
  const handleMouseDown = (e: React.MouseEvent, cardId: number, cardType: 'stack' | 'tech' | 'feature' | 'testimonial', cardIndex?: number) => {
    // Only allow dragging by the header area (first 40px from top)
    const targetElement = e.target as HTMLElement;
    const cardElement = targetElement.closest('.card') as HTMLElement;

    if (!cardElement) return;

    const cardRect = cardElement.getBoundingClientRect();
    const clickY = e.clientY - cardRect.top;

    // Only allow dragging from the top portion of the card (header area)
    if (clickY > 40) return;

    // Prevent default behavior and text selection
    e.preventDefault();

    // Create a unique ID for different card types
    const uniqueId = cardType === 'stack' ? cardId :
                     cardType === 'tech' ? 1000 + (cardIndex || 0) :
                     cardType === 'feature' ? 2000 + (cardIndex || 0) :
                     cardType === 'testimonial' ? cardId :
                     cardId;

    // Set initial drag state
    setDragState({
      isDragging: true,
      cardId: uniqueId,
      cardType: cardType,
      cardIndex: cardIndex,
      initialX: e.clientX,
      initialY: e.clientY,
      offsetX: cardPositions[uniqueId]?.x || 0,
      offsetY: cardPositions[uniqueId]?.y || 0
    });

    if (onDragStart) {
      onDragStart(uniqueId, cardType);
    }
  };

  // Add global mouse event listeners for drag
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragState.isDragging) return;

      const deltaX = e.clientX - dragState.initialX;
      const deltaY = e.clientY - dragState.initialY;

      // Update card position
      setCardPositions(prev => ({
        ...prev,
        [dragState.cardId!]: {
          x: dragState.offsetX + deltaX,
          y: dragState.offsetY + deltaY
        }
      }));
    };

    const onMouseUp = () => {
      if (dragState.isDragging) {
        const position = cardPositions[dragState.cardId!] || { x: 0, y: 0 };
        
        if (onDragEnd && dragState.cardId !== null) {
          onDragEnd(dragState.cardId, position);
        }

        setDragState(prev => ({
          ...prev,
          isDragging: false
        }));
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragState, cardPositions, onDragEnd]);

  const wrapperClasses = theme === 'dark' 
    ? 'bg-gray-900 text-gray-100' 
    : 'bg-gray-50 text-gray-900';

  return (
    <div className={`${wrapperClasses} ${className}`}>
      {/* Render children with drag functionality context */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            cardPositions,
            dragState,
            handleMouseDown,
            ...child.props
          });
        }
        return child;
      })}
      
      {/* Render additional sections */}
      {sections.map((section, index) => (
        <div key={index}>
          {section}
        </div>
      ))}
    </div>
  );
};

export default CardStacker;