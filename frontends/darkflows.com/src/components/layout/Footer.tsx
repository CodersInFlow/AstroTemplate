import React from 'react';
import { BaseComponentProps, NavigationLink, SocialLink } from '../../types';

export interface FooterSection {
  title: string;
  links: NavigationLink[];
}

export interface FooterProps extends BaseComponentProps {
  logo?: {
    text?: string;
    image?: string;
    href?: string;
  };
  description?: string;
  sections?: FooterSection[];
  socialLinks?: SocialLink[];
  copyright?: string;
  legalLinks?: NavigationLink[];
  theme?: 'light' | 'dark' | 'gradient';
  columns?: 2 | 3 | 4;
}

const Footer: React.FC<FooterProps> = ({
  logo,
  description,
  sections = [],
  socialLinks = [],
  copyright,
  legalLinks = [],
  className = '',
  theme = 'gradient',
  columns = 4
}) => {
  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          bg: 'bg-gray-50 text-gray-900',
          accent: 'text-gray-600',
          hover: 'hover:text-gray-900',
          border: 'border-gray-200'
        };
      case 'dark':
        return {
          bg: 'bg-gray-900 text-white',
          accent: 'text-gray-400',
          hover: 'hover:text-white',
          border: 'border-gray-700'
        };
      case 'gradient':
        return {
          bg: 'bg-gradient-to-r from-indigo-900 to-blue-800 text-white',
          accent: 'text-indigo-200',
          hover: 'hover:text-white',
          border: 'border-indigo-700'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-indigo-900 to-blue-800 text-white',
          accent: 'text-indigo-200',
          hover: 'hover:text-white',
          border: 'border-indigo-700'
        };
    }
  };

  const themeClasses = getThemeClasses();
  const gridClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
  };

  const renderLogo = () => {
    const logoContent = (
      <>
        {logo?.image && (
          <img src={logo.image} alt={logo.text || 'Logo'} className="h-8 w-auto mr-2" />
        )}
        {logo?.text && (
          <span className="text-3xl font-bold">{logo.text}</span>
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

  const renderSocialLinks = () => {
    if (socialLinks.length === 0) return null;

    return (
      <div className="flex space-x-4 mt-4">
        {socialLinks.map((social) => (
          <a
            key={social.platform}
            href={social.url}
            className={`${themeClasses.accent} ${themeClasses.hover} transition-colors`}
            aria-label={social.platform}
            target="_blank"
            rel="noopener noreferrer"
          >
            {typeof social.icon === 'string' ? (
              <img src={social.icon} alt={social.platform} className="w-6 h-6" />
            ) : (
              social.icon
            )}
          </a>
        ))}
      </div>
    );
  };

  return (
    <footer className={`${themeClasses.bg} py-16 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between mb-12">
          {/* Brand Section */}
          <div className="mb-8 md:mb-0 md:max-w-xs">
            {(logo?.text || logo?.image) && (
              <div className="mb-4">
                {renderLogo()}
              </div>
            )}
            {description && (
              <p className={`${themeClasses.accent} max-w-xs`}>
                {description}
              </p>
            )}
            {renderSocialLinks()}
          </div>

          {/* Footer Sections */}
          {sections.length > 0 && (
            <div className={`grid gap-8 ${gridClasses[columns]}`}>
              {sections.map((section, index) => (
                <div key={index}>
                  <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href={link.href}
                          className={`${themeClasses.accent} ${themeClasses.hover} transition-colors`}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className={`border-t ${themeClasses.border} pt-8 flex flex-col md:flex-row justify-between items-center`}>
          <p className={`${themeClasses.accent} mb-4 md:mb-0`}>
            {copyright || `© ${new Date().getFullYear()} All rights reserved.`}
          </p>
          
          {legalLinks.length > 0 && (
            <div className="flex space-x-6">
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`${themeClasses.accent} ${themeClasses.hover} transition-colors`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;