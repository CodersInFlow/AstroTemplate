import React, { useState } from 'react';
import { BaseComponentProps, NavigationLink } from '../../types';

export interface HeaderProps extends BaseComponentProps {
  logo?: {
    text?: string;
    image?: string;
    href?: string;
  };
  navigation?: NavigationLink[];
  ctaButton?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  theme?: 'light' | 'dark' | 'gradient';
  fixed?: boolean;
  showMobileMenu?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  logo,
  navigation = [],
  ctaButton,
  className = '',
  theme = 'gradient',
  fixed = true,
  showMobileMenu = true
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-white text-gray-900 border-b border-gray-200';
      case 'dark':
        return 'bg-gray-900 text-white';
      case 'gradient':
        return 'bg-gradient-to-r from-indigo-900 to-blue-800 text-white';
      default:
        return 'bg-gradient-to-r from-indigo-900 to-blue-800 text-white';
    }
  };

  const getLinkHoverClasses = () => {
    switch (theme) {
      case 'light':
        return 'hover:text-indigo-600';
      case 'dark':
        return 'hover:text-gray-300';
      case 'gradient':
        return 'hover:text-indigo-200';
      default:
        return 'hover:text-indigo-200';
    }
  };

  const getButtonClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-indigo-600 hover:bg-indigo-700 text-white';
      case 'dark':
        return 'bg-indigo-600 hover:bg-indigo-700 text-white';
      case 'gradient':
        return 'bg-indigo-500 hover:bg-indigo-600 text-white';
      default:
        return 'bg-indigo-500 hover:bg-indigo-600 text-white';
    }
  };

  const positionClasses = fixed ? 'fixed top-0 left-0 right-0 z-50' : 'relative';

  const renderLogo = () => {
    const logoContent = (
      <>
        {logo?.image && (
          <img src={logo.image} alt={logo.text || 'Logo'} className="h-8 w-auto mr-2" />
        )}
        {logo?.text && (
          <span className="text-2xl font-bold">{logo.text}</span>
        )}
      </>
    );

    if (logo?.href) {
      return (
        <a href={logo.href} className="flex items-center">
          {logoContent}
        </a>
      );
    }

    return (
      <div className="flex items-center">
        {logoContent}
      </div>
    );
  };

  const renderNavigation = (mobile = false) => {
    const baseClasses = mobile
      ? 'block px-3 py-2 text-base font-medium transition-colors'
      : 'hover:text-current transition-colors';

    return navigation.map((link) => (
      <a
        key={link.href}
        href={link.href}
        className={`${baseClasses} ${getLinkHoverClasses()}`}
        onClick={mobile ? () => setIsMobileMenuOpen(false) : undefined}
      >
        {link.label}
      </a>
    ));
  };

  const renderCTAButton = (mobile = false) => {
    if (!ctaButton) return null;

    const baseClasses = mobile
      ? 'block w-full text-center'
      : 'inline-block';

    const buttonClasses = `${baseClasses} px-4 py-2 rounded-lg transition-colors font-medium ${getButtonClasses()}`;

    if (ctaButton.href) {
      return (
        <a
          href={ctaButton.href}
          className={buttonClasses}
          onClick={mobile ? () => setIsMobileMenuOpen(false) : undefined}
        >
          {ctaButton.text}
        </a>
      );
    }

    return (
      <button
        onClick={() => {
          ctaButton.onClick?.();
          if (mobile) setIsMobileMenuOpen(false);
        }}
        className={buttonClasses}
      >
        {ctaButton.text}
      </button>
    );
  };

  return (
    <header className={`${positionClasses} ${getThemeClasses()} shadow-lg ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            {renderLogo()}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            {renderNavigation()}
            {renderCTAButton()}
          </nav>

          {/* Mobile Menu Button */}
          {showMobileMenu && (
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-opacity-20">
            <nav className="flex flex-col space-y-2 pt-4">
              {renderNavigation(true)}
              {ctaButton && (
                <div className="pt-2">
                  {renderCTAButton(true)}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;