import React, { useState, useEffect } from 'react';
import { TableOfContentsItem } from '../../types';

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>('');
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -70% 0%',
      }
    );
    
    // Observe all headings
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });
    
    return () => {
      observer.disconnect();
    };
  }, [items]);
  
  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const renderItems = (items: TableOfContentsItem[], depth = 0) => {
    return (
      <ul className={`toc-list toc-level-${depth}`}>
        {items.map((item) => (
          <li key={item.id} className="toc-item">
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`toc-link ${activeId === item.id ? 'active' : ''}`}
              style={{ paddingLeft: `${depth * 16}px` }}
            >
              {item.text}
            </a>
            {item.children && item.children.length > 0 && 
              renderItems(item.children, depth + 1)
            }
          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <nav className="table-of-contents">
      <h3 className="toc-title">Table of Contents</h3>
      {renderItems(items)}
    </nav>
  );
};