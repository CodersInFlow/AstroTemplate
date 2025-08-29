import React, { forwardRef } from 'react';
import { BaseComponentProps } from '../../types';

export interface InputProps extends BaseComponentProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  variant?: 'default' | 'filled' | 'outlined';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  size = 'md',
  theme = 'light',
  variant = 'default',
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}, ref) => {
  const isDark = theme === 'dark';

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-3 py-2 text-sm';
      case 'lg':
        return 'px-4 py-3 text-base';
      default:
        return 'px-3 py-2 text-sm';
    }
  };

  const getVariantClasses = () => {
    const baseClasses = 'block w-full rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';
    
    switch (variant) {
      case 'filled':
        return isDark
          ? `${baseClasses} bg-gray-800 border-0 text-white placeholder-gray-400 focus:bg-gray-700`
          : `${baseClasses} bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:bg-white`;
      case 'outlined':
        return isDark
          ? `${baseClasses} bg-transparent border-2 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500`
          : `${baseClasses} bg-transparent border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500`;
      default:
        return isDark
          ? `${baseClasses} bg-gray-900 border border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500`
          : `${baseClasses} bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500`;
    }
  };

  const labelClasses = isDark
    ? 'block text-sm font-medium text-gray-200 mb-1'
    : 'block text-sm font-medium text-gray-700 mb-1';

  const errorClasses = 'mt-1 text-sm text-red-500';
  const helperClasses = isDark
    ? 'mt-1 text-sm text-gray-400'
    : 'mt-1 text-sm text-gray-500';

  const sizeClasses = getSizeClasses();
  const variantClasses = getVariantClasses();
  const hasIcons = leftIcon || rightIcon;

  const inputClasses = `
    ${variantClasses} 
    ${sizeClasses} 
    ${hasIcons ? 'relative' : ''} 
    ${leftIcon ? 'pl-10' : ''} 
    ${rightIcon ? 'pr-10' : ''} 
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} 
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''} 
    ${className}
  `.trim();

  return (
    <div className="w-full">
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          disabled={disabled}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className={errorClasses}>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className={helperClasses}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;