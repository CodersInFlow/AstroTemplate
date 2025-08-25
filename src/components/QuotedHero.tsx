import React, { useEffect } from 'react';

interface QuotedHeroProps {
  title: string;
  subtitle: string;
  quote: {
    text: string;
    authorName: string;
    authorTitle: string;
    authorAvatar?: string;
  };
}

const QuotedHero: React.FC<QuotedHeroProps> = ({ title, subtitle, quote }) => {
  useEffect(() => {
    // Smooth scroll behavior for scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        const firstSection = document.querySelector('.billing-feature-section');
        if (firstSection) {
          firstSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }, []);

  // Split title into words for individual animation
  const titleWords = title.split(' ');

  return (
    <section className="quoted-hero min-h-screen flex flex-col justify-center items-center text-center p-8 relative bg-gradient-to-br from-[#0a0e27] to-[#151935] overflow-hidden">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white">
        {titleWords.map((word, index) => (
          <span
            key={index}
            className={`inline-block mr-4 ${
              index % 2 === 0 ? 'animate-slideInLeft' : 'animate-slideInRight'
            }`}
            style={{ 
              animationDelay: `${index * 0.15}s`,
              opacity: 0,
              transform: index % 2 === 0 ? 'translateX(-100%)' : 'translateX(100%)',
              animationFillMode: 'forwards'
            }}
          >
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              {word}
            </span>
          </span>
        ))}
      </h1>
      <p className="text-xl md:text-2xl text-gray-400 max-w-3xl animate-slideInRight mb-24"
         style={{ 
           opacity: 0,
           transform: 'translateX(100%)',
           animationDelay: '0.6s',
           animationFillMode: 'forwards'
         }}>
        {subtitle}
      </p>
      
      {/* Quote Section */}
      <div className="quote-container max-w-4xl mx-auto animate-slideInLeft flex items-start gap-12 px-8"
           style={{ 
             opacity: 0,
             transform: 'translateX(-100%)',
             animationDelay: '0.9s',
             animationFillMode: 'forwards'
           }}>
        <div className="quote-content flex-1 relative">
          <div className="quote-mark absolute -top-5 -left-8 text-7xl text-cyan-400 opacity-80 font-serif leading-none">
            "
          </div>
          <p className="quote-text text-base md:text-lg leading-relaxed text-white m-0 font-normal italic tracking-normal">
            {quote.text}
          </p>
        </div>
        <div className="quote-attribution flex items-center gap-6 flex-shrink-0">
          <div className="author-info text-right">
            <div className="author-name text-lg font-semibold text-white mb-1">
              {quote.authorName}
            </div>
            <div className="author-title text-sm text-gray-400">
              {quote.authorTitle}
            </div>
          </div>
          {quote.authorAvatar ? (
            <img 
              src={quote.authorAvatar} 
              alt={quote.authorName} 
              className="author-avatar w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <div className="author-avatar w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold text-xl">
              {quote.authorName.split(' ').map(n => n[0]).join('')}
            </div>
          )}
        </div>
      </div>
      
      <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 animate-fadeIn cursor-pointer"
           style={{ 
             opacity: 0,
             animationDelay: '1.2s',
             animationFillMode: 'forwards'
           }}>
        <svg className="w-8 h-8 fill-purple-500 animate-bounce" viewBox="0 0 24 24">
          <path d="M12 16l-6-6h12z"/>
        </svg>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease forwards;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-900 {
          animation-delay: 0.9s;
        }

        .animation-delay-1200 {
          animation-delay: 1.2s;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-10px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
          }
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }

        /* Responsive adjustments */
        @media (max-width: 968px) {
          .quote-container {
            flex-direction: column;
            gap: 1.5rem;
          }

          .quote-attribution {
            flex-direction: row-reverse;
            align-self: flex-end;
          }

          .author-info {
            text-align: left;
          }

          .quote-mark {
            left: -20px;
            font-size: 60px;
          }
        }
      `}</style>
    </section>
  );
};

export default QuotedHero;