
import React, { useState, useEffect } from 'react';
import DraggableCustomizableCard from '../DraggableCustomizableCard';

const WhyBetterSection: React.FC = () => {
  const [cardsVisible, setCardsVisible] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    // Animate cards in sequence when component mounts
    const timer1 = setTimeout(() => setCardsVisible([true, false, false]), 100);
    const timer2 = setTimeout(() => setCardsVisible([true, true, false]), 400);
    const timer3 = setTimeout(() => setCardsVisible([true, true, true]), 700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="w-full bg-gradient-to-b from-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Three Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
          {/* Card 1 */}
          <div className={`flex justify-center transition-all duration-700 transform ${
            cardsVisible[0] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <DraggableCustomizableCard 
              width={400} 
              height={560}
              title="Advanced Code Understanding"
            >
              <div className="h-full flex flex-col p-2">
                <div className="mb-6">
                  <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 mb-4 transition-all duration-500 hover:w-24"></div>
                  <h4 className="text-2xl font-bold text-gray-100 mb-3">Code Understanding</h4>
                  <p className="text-sm text-gray-400 leading-relaxed"></p>
                </div>
                <div className="space-y-5 text-left flex-1">
                  <div className="group">
                    <div className="flex items-start">
                      <div className="w-1 h-12 bg-gradient-to-b from-indigo-500 to-transparent mr-4 transition-all duration-300 group-hover:h-14"></div>
                      <div>
                        <h5 className="text-sm font-semibold text-gray-200 mb-1">Automatic Codebase Documentation</h5>
                        <p className="text-xs text-gray-400 leading-relaxed">AI analyzes and documents your entire codebase. 50%+ reduction in token usage through deep understanding. Framework-specific intelligence (React vs Django vs Rails).</p>
                      </div>
                    </div>
                  </div>
                  <div className="group">
                    <div className="flex items-start">
                      <div className="w-1 h-12 bg-gradient-to-b from-purple-500 to-transparent mr-4 transition-all duration-300 group-hover:h-14"></div>
                      <div>
                        <h5 className="text-sm font-semibold text-gray-200 mb-1">Intelligent Project Awareness</h5>
                        <p className="text-xs text-gray-400 leading-relaxed">Generates executive summaries of your architecture. Maps all component relationships automatically. Understands your specific design patterns.</p>
                      </div>
                    </div>
                  </div>
                  <div className="group">
                    <div className="flex items-start">
                      <div className="w-1 h-12 bg-gradient-to-b from-indigo-500 to-transparent mr-4 transition-all duration-300 group-hover:h-14"></div>
                      <div>
                        <h5 className="text-sm font-semibold text-gray-200 mb-1">Context-Aware Search</h5>
                        <p className="text-xs text-gray-400 leading-relaxed">Customizes queries for YOUR tech stack. AST-aware code chunking for precision. Real-time index updates as you code.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Automatic Context Compression</span>
                    <span>Savings: 50%</span>
                  </div>
                </div>
              </div>
            </DraggableCustomizableCard>
          </div>
          
          {/* Card 2 */}
          <div className={`flex justify-center transition-all duration-700 transform ${
            cardsVisible[1] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`} style={{ marginTop: '-35px' }}>
            <DraggableCustomizableCard 
              width={400} 
              height={560}
              title="Optimized Cost Structure"
            >
              <div className="h-full flex flex-col p-2">
                <div className="mb-6">
                  <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-emerald-500 mb-4 transition-all duration-500 hover:w-24"></div>
                  <h4 className="text-2xl font-bold text-gray-100 mb-3">Continious Context Compression</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">AI edits and removes chunks from context as it works for optimum savings</p>
                </div>
                <div className="space-y-5 text-left flex-1">
                  <div className="group">
                    <div className="flex items-start">
                      <div className="w-1 h-12 bg-gradient-to-b from-green-500 to-transparent mr-4 transition-all duration-300 group-hover:h-14"></div>
                      <div>
                        <h5 className="text-sm font-semibold text-gray-200 mb-1">Automatic Model Selection</h5>
                        <p className="text-xs text-gray-400 leading-relaxed">AI chooses the cheapest capable model for each task.</p>
                      </div>
                    </div>
                  </div>
                  <div className="group">
                    <div className="flex items-start">
                      <div className="w-1 h-12 bg-gradient-to-b from-emerald-500 to-transparent mr-4 transition-all duration-300 group-hover:h-14"></div>
                      <div>
                        <h5 className="text-sm font-semibold text-gray-200 mb-1">Multi-Task Efficiency</h5>
                        <p className="text-xs text-gray-400 leading-relaxed">20+ concurrent tasks with focused contexts. Each subtask uses minimal tokens. Main context stays small = massive savings.</p>
                      </div>
                    </div>
                  </div>
                  <div className="group">
                    <div className="flex items-start">
                      <div className="w-1 h-12 bg-gradient-to-b from-green-500 to-transparent mr-4 transition-all duration-300 group-hover:h-14"></div>
                      <div>
                        <h5 className="text-sm font-semibold text-gray-200 mb-1">Smart Context Management</h5>
                        <p className="text-xs text-gray-400 leading-relaxed">Automatic conversation condensing. Token-perfect counting for every model. Budget enforcement per task or globally.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Huge Savings</span>
                    <span>Estimated: 50-75%</span>
                  </div>
                </div>
              </div>
            </DraggableCustomizableCard>
          </div>
          
          {/* Card 3 */}
          <div className={`flex justify-center transition-all duration-700 transform ${
            cardsVisible[2] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <DraggableCustomizableCard 
              width={400} 
              height={560}
              title="Rapid Development"
            >
              <div className="h-full flex flex-col p-2">
                <div className="mb-6">
                  <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-red-500 mb-4 transition-all duration-500 hover:w-24"></div>
                  <h4 className="text-2xl font-bold text-gray-100 mb-3">Latest Features and AI</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">Our system is truely dynamic so we always get the latest Models the second they are available.</p>
                </div>
                <div className="space-y-5 text-left flex-1">
                  <div className="group">
                    <div className="flex items-start">
                      <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-transparent mr-4 transition-all duration-300 group-hover:h-14"></div>
                      <div>
                        <h5 className="text-sm font-semibold text-gray-200 mb-1">Modular Design</h5>
                        <p className="text-xs text-gray-400 leading-relaxed">Our system is build from a modular design so implementing new features is often done with in minutes.</p>
                      </div>
                    </div>
                  </div>
                  <div className="group">
                    <div className="flex items-start">
                      <div className="w-1 h-12 bg-gradient-to-b from-red-500 to-transparent mr-4 transition-all duration-300 group-hover:h-14"></div>
                      <div>
                        <h5 className="text-sm font-semibold text-gray-200 mb-1">Cutting Edge Development</h5>
                        <p className="text-xs text-gray-400 leading-relaxed">We were the first to implement features in our tool, and still have many features not available in the competition.</p>
                      </div>
                    </div>
                  </div>
                  <div className="group">
                    <div className="flex items-start">
                      <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-transparent mr-4 transition-all duration-300 group-hover:h-14"></div>
                      <div>
                        <h5 className="text-sm font-semibold text-gray-200 mb-1">Rapid Development Cycle</h5>
                        <p className="text-xs text-gray-400 leading-relaxed">As fast as we cane think of new ideas, or users provider suggestions we will implement them in our tool.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Code quality score: 98.7/100</span>
                    <span>Bug rate: -94%</span>
                  </div>
                </div>
              </div>
            </DraggableCustomizableCard>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default WhyBetterSection;
