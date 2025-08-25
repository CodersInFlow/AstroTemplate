import React from 'react';

const HeroComparison: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#0a0e27] via-[#151935] to-[#0a0e27] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            {/* Competitor badges */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-gray-400 text-sm">Coders in Flow vs. Competition</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Coders in Flow<br />
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                AI Powered Development team
              </span><br />
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                in VS Code.
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Work 10x faster, its like having a full development team in the palm of your hands. Powerful AI coding assistant that works for 
              engineers, developers and the average person, boosting productivity, code quality, and 
              collaboration.
            </p>
            
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              When comparing Coders in Flow and other AI assistants, discover how 
              our true multitasking platform with AI Companion capabilities can transform 
              team collaboration, reduce costs, and enhance the experience for 
              developers and customers.
            </p>
            
            {/* CTA Button */}
            <button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
              onClick={() => window.location.href = '/features'}
            >
              ↓Scroll for more↓ , or click for features
            </button>
          </div>
          
          {/* Right Images */}
          <div className="relative h-[400px] lg:h-[500px]">
            {/* Background glow effects */}
            <div className="absolute top-20 right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
            
            {/* Main IDE Screenshot */}
            <div className="absolute top-0 right-0 w-[320px] md:w-[380px] transform rotate-3 hover:rotate-2 transition-transform duration-300">
              <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-400 text-xs ml-2">main.tsx</span>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded bg-purple-500 flex items-center justify-center text-white text-xs font-bold">AI</div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-700 rounded w-3/4 mb-2" />
                      <div className="h-2 bg-gray-700 rounded w-full mb-2" />
                      <div className="h-2 bg-gray-700 rounded w-2/3" />
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded p-3 border border-gray-700">
                    <div className="text-green-400 text-xs font-mono mb-1">// AI-generated code</div>
                    <div className="h-2 bg-gray-600 rounded w-full mb-1" />
                    <div className="h-2 bg-gray-600 rounded w-4/5 mb-1" />
                    <div className="h-2 bg-gray-600 rounded w-3/4" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feature Card */}
            <div className="absolute bottom-0 left-0 w-[280px] md:w-[340px] transform -rotate-3 hover:-rotate-2 transition-transform duration-300">
              <div className="bg-white rounded-xl shadow-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-gray-900 font-semibold">Compare with Coders in Flow AI Companion</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Experience 20+ concurrent tasks, full code analysis, automatic code correction, and 60% cost reduction compared 
                  to any other solution.
                </p>
                <button 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                  onClick={() => window.location.href = '/download'}
                >
                  Start Free →
                </button>
              </div>
            </div>
            
            {/* Floating badges */}
            <div className="absolute top-10 left-10 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 text-green-400 text-sm font-semibold animate-pulse">
              20× Faster
            </div>
            
            <div className="absolute top-32 right-10 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 text-blue-400 text-sm font-semibold animate-pulse animation-delay-300">
              60% Cheaper
            </div>
            
            <div className="absolute bottom-32 right-20 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 text-purple-400 text-sm font-semibold animate-pulse animation-delay-600">
              100% Better
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </section>
  );
};

export default HeroComparison;