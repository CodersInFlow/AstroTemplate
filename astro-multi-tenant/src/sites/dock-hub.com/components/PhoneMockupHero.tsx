import React from 'react';
import { ScrollAnimation } from '../../../shared/components/utils/ScrollAnimation';

interface PhoneMockupHeroProps {
  data: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    primaryButton: {
      text: string;
      link: string;
    };
    secondaryButton: {
      text: string;
      link: string;
    };
    phoneMockup: {
      appName: string;
      status: string;
      upButton: {
        label: string;
        color: string;
      };
      downButton: {
        label: string;
        color: string;
      };
    };
  };
}

const PhoneMockupHero: React.FC<PhoneMockupHeroProps> = ({ data }) => {
  return (
    <section className="pt-16 pb-10 text-white relative overflow-hidden bg-gradient-to-br from-background to-surface">
      {/* Animated background pattern */}
      <div 
        className="absolute inset-0 -left-1/2 w-[200%] h-full opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ff88' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'float 20s infinite linear'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Hero Text */}
          <ScrollAnimation animation="slide-in-left" className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {data.title}{' '}
              <span className="text-primary">{data.titleHighlight}</span>
            </h1>
            <p className="text-lg mb-6 text-text-secondary">
              {data.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <a 
                href={data.primaryButton.link} 
                className="px-6 py-3 rounded-full font-semibold bg-primary text-text-inverse hover:bg-link-hover hover:-translate-y-0.5 transition-all shadow-lg"
              >
                {data.primaryButton.text}
              </a>
              <a 
                href={data.secondaryButton.link}
                className="px-6 py-3 bg-transparent text-white border-2 border-primary rounded-full font-semibold hover:bg-primary hover:text-text-inverse transition-all"
              >
                {data.secondaryButton.text}
              </a>
            </div>
          </ScrollAnimation>

          {/* Phone Mockup */}
          <ScrollAnimation animation="slide-in-right" className="flex justify-center">
            <div className="w-56 h-[28rem] bg-black rounded-3xl p-2 shadow-2xl border-2 border-primary relative">
              {/* Phone notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-10"></div>
              
              <div className="w-full h-full bg-white rounded-2xl flex flex-col items-center justify-center overflow-hidden">
                <div className="w-11/12 text-center">
                  <div className="py-3 rounded-t-lg font-bold text-sm bg-background text-primary">
                    {data.phoneMockup.appName}
                  </div>
                  <div className="py-6 rounded-b-lg bg-gray-50">
                    <button className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 hover:scale-110 transition-transform shadow-lg bg-primary text-text-inverse">
                      {data.phoneMockup.upButton.label}
                    </button>
                    <p className="text-sm mb-4 text-gray-700">
                      {data.phoneMockup.status}
                    </p>
                    <button 
                      className="w-20 h-20 rounded-full text-white flex items-center justify-center text-3xl font-bold mx-auto hover:scale-110 transition-transform shadow-lg"
                      style={{ backgroundColor: data.phoneMockup.downButton.color }}
                    >
                      {data.phoneMockup.downButton.label}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
};

export default PhoneMockupHero;