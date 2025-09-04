import React, { useState, useEffect } from 'react';
import { ScrollAnimation, useScrollAnimation } from '../../../shared/components/utils/ScrollAnimation';

interface Step {
  number: string;
  title: string;
  description: string;
  icon?: string;
}

interface StepByStepProcessProps {
  data: {
    title: string;
    subtitle?: string;
    steps: Step[];
  };
}

const StepByStepProcess: React.FC<StepByStepProcessProps> = ({ data }) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  // Activate steps sequentially when section becomes visible
  useEffect(() => {
    if (isVisible && activeStep === null) {
      data.steps.forEach((_, index) => {
        setTimeout(() => {
          setActiveStep(index);
        }, index * 500);
      });
    }
  }, [isVisible, activeStep, data.steps]);

  return (
    <section ref={ref as any} className="py-16 bg-gradient-to-b from-white to-gray-50">
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

        <div className="relative">
          {/* Connection line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0">
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-out"
              style={{
                width: activeStep !== null ? `${((activeStep + 1) / data.steps.length) * 100}%` : '0%'
              }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {data.steps.map((step, index) => (
              <ScrollAnimation
                key={index}
                animation="scale-in"
                delay={index * 200}
                className="text-center"
              >
                <div className={`transition-all duration-500 ${
                  activeStep !== null && index <= activeStep ? 'opacity-100' : 'opacity-50'
                }`}>
                  {/* Step number circle */}
                  <div className="relative mb-6 flex justify-center">
                    <div className={`
                      w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold
                      transition-all duration-500 shadow-lg
                      ${activeStep !== null && index <= activeStep 
                        ? 'bg-primary text-text-inverse scale-110' 
                        : 'bg-white text-gray-400 border-2 border-gray-200'}
                    `}>
                      {step.icon || step.number}
                    </div>
                    
                    {/* Pulse effect for active step */}
                    {activeStep === index && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-primary rounded-full animate-ping opacity-25" />
                      </div>
                    )}
                  </div>

                  {/* Step content */}
                  <div className={`
                    bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300
                    ${activeStep !== null && index <= activeStep ? 'transform hover:-translate-y-1' : ''}
                  `}>
                    <h3 className="text-xl font-semibold mb-3 text-background">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>

        {/* Mobile connection line */}
        <div className="md:hidden mt-8 flex justify-center">
          <div className="flex gap-2">
            {data.steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full transition-all duration-500 ${
                  activeStep !== null && index <= activeStep 
                    ? 'bg-primary' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepByStepProcess;