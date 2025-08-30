import React from 'react';
import { BaseComponentProps } from '../../types';

export interface CardProps extends BaseComponentProps {
  theme?: 'light' | 'dark';
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  theme = 'light',
  variant = 'default',
  padding = 'md',
  hover = false,
  header,
  footer,
  className = '',
  children,
  ...props
}) => {
  const isDark = theme === 'dark';

  const getPaddingClasses = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'sm':
        return 'p-3';
      case 'md':
        return 'p-6';
      case 'lg':
        return 'p-8';
      default:
        return 'p-6';
    }
  };

  const getVariantClasses = () => {
    const baseClasses = 'rounded-lg transition-all duration-200';
    
    switch (variant) {
      case 'elevated':
        return isDark
          ? `${baseClasses} bg-gray-800 shadow-xl border border-gray-700`
          : `${baseClasses} bg-white shadow-xl border border-gray-100`;
      case 'outlined':
        return isDark
          ? `${baseClasses} bg-transparent border-2 border-gray-600`
          : `${baseClasses} bg-transparent border-2 border-gray-300`;
      case 'filled':
        return isDark
          ? `${baseClasses} bg-gray-800`
          : `${baseClasses} bg-gray-100`;
      default:
        return isDark
          ? `${baseClasses} bg-gray-800 shadow-md border border-gray-700`
          : `${baseClasses} bg-white shadow-md border border-gray-200`;
    }
  };

  const getHoverClasses = () => {
    if (!hover) return '';
    
    return isDark
      ? 'hover:bg-gray-750 hover:shadow-lg hover:scale-[1.02] cursor-pointer'
      : 'hover:bg-gray-50 hover:shadow-lg hover:scale-[1.02] cursor-pointer';
  };

  const paddingClasses = getPaddingClasses();
  const variantClasses = getVariantClasses();
  const hoverClasses = getHoverClasses();

  const cardClasses = `${variantClasses} ${hoverClasses} ${className}`.trim();
  const contentPadding = header || footer ? '' : paddingClasses;

  return (
    <div className={cardClasses} {...props}>
      {header && (
        <div className={`${paddingClasses} ${footer || children ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
          {header}
        </div>
      )}
      
      {children && (
        <div className={contentPadding}>
          {children}
        </div>
      )}
      
      {footer && (
        <div className={`${paddingClasses} ${header || children ? 'border-t border-gray-200 dark:border-gray-700' : ''}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;