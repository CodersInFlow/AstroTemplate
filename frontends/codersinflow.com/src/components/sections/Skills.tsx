import React, { useEffect, useRef, useState } from 'react';
import { BaseComponentProps, SkillData } from '../../types';

export interface SkillsProps extends BaseComponentProps {
  skills: SkillData[];
  title: string;
  description?: string;
  theme?: 'light' | 'dark';
  color?: string;
  showAnimation?: boolean;
  columns?: 1 | 2;
}

interface SkillBarProps {
  skill: SkillData;
  color: string;
  theme: 'light' | 'dark';
  animated: boolean;
}

const SkillBar: React.FC<SkillBarProps> = ({ skill, color, theme, animated }) => {
  const isDark = theme === 'dark';
  const titleClasses = isDark ? 'text-white' : 'text-black';
  const barBgClasses = isDark ? 'bg-gray-700' : 'bg-gray-200';
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className={`text-sm font-medium ${titleClasses}`}>
          {skill.name}
        </span>
        <span className={`text-sm ${titleClasses} opacity-70`}>
          {skill.level}%
        </span>
      </div>
      <div className={`w-full h-2 rounded-full ${barBgClasses}`}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: animated ? `${skill.level}%` : '0%',
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
};

const Skills: React.FC<SkillsProps> = ({
  skills,
  title,
  description,
  className = '',
  theme = 'light',
  color = '#6366f1', // indigo-500
  showAnimation = true,
  columns = 2
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const isDark = theme === 'dark';

  const titleClasses = isDark ? 'text-white' : 'text-black';
  const descriptionClasses = isDark ? 'text-gray-300' : 'text-gray-600';

  useEffect(() => {
    if (!showAnimation) {
      setHasAnimated(true);
      return;
    }

    const currentRef = ref.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px 100px 0px'
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [showAnimation]);

  // Group skills by category if they have categories
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, SkillData[]>);

  const categories = Object.keys(groupedSkills);
  const shouldShowCategories = categories.length > 1 || categories[0] !== 'General';

  const gridClasses = columns === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2';

  return (
    <section
      ref={ref}
      className={`flex w-full items-center justify-center p-8 transition-all duration-1000 ${
        hasAnimated
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-[200px] scale-[0.3]'
      } ${className}`}
      style={{
        willChange: 'opacity, transform',
        animationFillMode: 'forwards'
      }}
    >
      <div className="w-full max-w-4xl">
        {/* Title */}
        <h3 className={`text-2xl md:text-3xl font-bold mb-2 text-center lg:text-left ${titleClasses}`}>
          {title}
        </h3>

        {shouldShowCategories ? (
          // Render skills grouped by category
          <div className={`grid ${gridClasses} gap-8 mt-8`}>
            {categories.map((category) => (
              <div key={category} className="space-y-4">
                {category !== 'General' && (
                  <h4 className={`text-lg font-semibold mb-4 ${titleClasses}`}>
                    {category}
                  </h4>
                )}
                {groupedSkills[category].map((skill) => (
                  <SkillBar
                    key={skill.id}
                    skill={skill}
                    color={color}
                    theme={theme}
                    animated={hasAnimated}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          // Render all skills in a single group
          <div className={`grid ${gridClasses} gap-6 mt-8`}>
            {skills.map((skill) => (
              <SkillBar
                key={skill.id}
                skill={skill}
                color={color}
                theme={theme}
                animated={hasAnimated}
              />
            ))}
          </div>
        )}

        {/* Description */}
        {description && (
          <div
            className={`mt-6 text-center lg:text-left ${descriptionClasses}`}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>
    </section>
  );
};

export default Skills;