import React from 'react';
import { BaseComponentProps, ProjectData } from '../../types';

export interface ProjectsProps extends BaseComponentProps {
  projects: ProjectData[];
  title?: string;
  description?: string;
  titleImage?: string;
  titleImageAlt?: string;
  theme?: 'light' | 'dark';
  columns?: 1 | 2 | 3 | 4;
}

const Projects: React.FC<ProjectsProps> = ({
  projects,
  title = 'Projects',
  description,
  titleImage,
  titleImageAlt,
  className = '',
  theme = 'light',
  columns = 3
}) => {
  const isDark = theme === 'dark';
  
  const titleClasses = isDark ? 'text-white' : 'text-black';
  const descriptionClasses = isDark ? 'text-gray-300' : 'text-gray-600';
  const cardClasses = isDark 
    ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
    : 'bg-white border-gray-200 hover:bg-gray-50';

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <section className={className}>
      {/* Title Section */}
      <div className="flex flex-col items-center text-center mb-12">
        {titleImage && (
          <div className="mb-6">
            <img 
              src={titleImage} 
              alt={titleImageAlt || title} 
              className="w-24 h-24 object-contain"
            />
          </div>
        )}
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${titleClasses}`}>
          {title}
        </h2>
        {description && (
          <p className={`text-lg max-w-4xl mx-auto ${descriptionClasses}`}>
            {description}
          </p>
        )}
      </div>

      {/* Projects Grid */}
      <div className="flex items-center justify-center">
        <div className={`grid ${gridClasses[columns]} gap-6 p-5 w-full max-w-6xl`}>
          {projects.map((project) => (
            <div
              key={project.id}
              className={`rounded-lg border overflow-hidden transition-all duration-300 hover:shadow-lg ${cardClasses}`}
            >
              {/* Project Image */}
              {project.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}

              {/* Project Content */}
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-2 ${titleClasses}`}>
                  {project.title}
                </h3>
                <p className={`text-sm mb-4 ${descriptionClasses}`}>
                  {project.description}
                </p>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded-full ${
                            isDark
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-3">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                        isDark
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      View Project
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 text-sm rounded-md font-medium border transition-colors ${
                        isDark
                          ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
                          : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;