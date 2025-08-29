import React, { useState } from 'react';
import { BaseComponentProps, NavigationLink } from '../../types';

export interface NavigationProps extends BaseComponentProps {
  links: NavigationLink[];
  orientation?: 'horizontal' | 'vertical';
  theme?: 'light' | 'dark';
  activeLink?: string;
  onLinkClick?: (href: string, label: string) => void;
  showDropdown?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  links,
  orientation = 'horizontal',
  theme = 'light',
  activeLink,
  onLinkClick,
  showDropdown = true,
  className = ''
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const isDark = theme === 'dark';

  const baseClasses = orientation === 'horizontal' 
    ? 'flex space-x-6' 
    : 'flex flex-col space-y-2';

  const linkClasses = isDark
    ? 'text-gray-300 hover:text-white'
    : 'text-gray-700 hover:text-gray-900';

  const activeLinkClasses = isDark
    ? 'text-white font-medium'
    : 'text-gray-900 font-medium';

  const dropdownClasses = isDark
    ? 'bg-gray-800 border-gray-700 shadow-lg'
    : 'bg-white border-gray-200 shadow-lg';

  const handleLinkClick = (href: string, label: string) => {
    onLinkClick?.(href, label);
    setOpenDropdown(null);
  };

  const renderDropdown = (parentLink: NavigationLink) => {
    if (!parentLink.children || !showDropdown) return null;

    const isOpen = openDropdown === parentLink.href;

    return (
      <div className="relative">
        <button
          className={`flex items-center space-x-1 transition-colors ${
            activeLink === parentLink.href ? activeLinkClasses : linkClasses
          }`}
          onClick={() => setOpenDropdown(isOpen ? null : parentLink.href)}
          aria-expanded={isOpen}
        >
          <span>{parentLink.label}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className={`absolute top-full left-0 mt-2 py-2 min-w-[200px] rounded-md border ${dropdownClasses} z-50`}>
            {parentLink.children.map((childLink, index) => (
              <a
                key={index}
                href={childLink.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(childLink.href, childLink.label);
                }}
                className={`block px-4 py-2 text-sm transition-colors ${
                  activeLink === childLink.href
                    ? activeLinkClasses
                    : `${linkClasses} hover:bg-gray-50 ${isDark ? 'hover:bg-gray-700' : ''}`
                }`}
              >
                {childLink.label}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderLink = (link: NavigationLink) => {
    // If link has children, render as dropdown
    if (link.children && link.children.length > 0) {
      return renderDropdown(link);
    }

    // Regular link
    return (
      <a
        href={link.href}
        onClick={(e) => {
          e.preventDefault();
          handleLinkClick(link.href, link.label);
        }}
        className={`transition-colors ${
          activeLink === link.href ? activeLinkClasses : linkClasses
        }`}
      >
        {link.label}
      </a>
    );
  };

  return (
    <nav className={`${baseClasses} ${className}`}>
      {links.map((link, index) => (
        <div key={index}>
          {renderLink(link)}
        </div>
      ))}
    </nav>
  );
};

export default Navigation;