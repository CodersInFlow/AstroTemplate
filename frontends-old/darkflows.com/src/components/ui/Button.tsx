import React from 'react';
import { BaseComponentProps } from '../../types';

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  target?: string;
  theme?: 'light' | 'dark';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  href,
  target,
  theme = 'light',
  className = '',
  children,
  ...props
}) => {
  const isDark = theme === 'dark';

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500';
      case 'secondary':
        return isDark
          ? 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-400';
      case 'outline':
        return isDark
          ? 'border border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-gray-500'
          : 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400';
      case 'ghost':
        return isDark
          ? 'text-gray-300 hover:bg-gray-800 focus:ring-gray-500'
          : 'text-gray-700 hover:bg-gray-100 focus:ring-gray-400';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
      default:
        return 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();
  
  const buttonClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

  const renderLoadingSpinner = () => (
    <svg
      className="w-4 h-4 mr-2 animate-spin"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={buttonClasses}
        {...props}
      >
        {loading && renderLoadingSpinner()}
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      {...props}
    >
      {loading && renderLoadingSpinner()}
      {children}
    </button>
  );
};

export default Button;