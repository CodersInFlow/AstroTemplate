import React from 'react';
import { ScrollAnimation } from '../../../shared/components/utils/ScrollAnimation';

interface Problem {
  emoji: string;
  title: string;
  description: string;
  highlightText?: string;
}

interface ProblemsCardsProps {
  data: {
    title: string;
    subtitle: string;
    problems: Problem[];
  };
}

const ProblemsCards: React.FC<ProblemsCardsProps> = ({ data }) => {
  // Animation delays for staggered effect
  const getAnimationDelay = (index: number) => index * 150;
  
  // Alternate animations for visual interest
  const getAnimation = (index: number) => {
    const animations = ['fade-in-up', 'fade-in-down', 'slide-in-left', 'slide-in-right'];
    return animations[index % animations.length] as any;
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollAnimation animation="fade-in-up" className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-background">
            {data.title}
          </h2>
          {data.subtitle && (
            <p className="text-lg text-gray-600">
              {data.subtitle}
            </p>
          )}
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 gap-6">
          {data.problems.map((problem, index) => (
            <ScrollAnimation
              key={index}
              animation={getAnimation(index)}
              delay={getAnimationDelay(index)}
              className="group"
            >
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-4xl group-hover:scale-110 transition-transform">
                    {problem.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-background">
                      {problem.title}
                    </h3>
                    <p className="text-gray-600">
                      {problem.highlightText ? (
                        <>
                          {problem.description.split(problem.highlightText)[0]}
                          <span className="bg-warning text-background px-1 py-0.5 rounded font-medium">
                            {problem.highlightText}
                          </span>
                          {problem.description.split(problem.highlightText)[1]}
                        </>
                      ) : (
                        problem.description
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemsCards;