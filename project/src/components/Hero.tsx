import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="pt-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left column - Content */}
          <div className="mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              AI-Powered Audit and{' '}
              <span className="text-blue-600">Compliance Solutions</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Automate your audits, save time, and ensure compliance with AI-driven insights. 
              Transform your audit processes with intelligent automation and real-time analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/upload"
                className="group inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <button className="group inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200">
                <Play className="mr-2 h-5 w-5" />
                Learn More
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Trusted by leading organizations</p>
              <div className="flex items-center space-x-8 opacity-60">
                <div className="text-gray-400 font-semibold">Enterprise Corp</div>
                <div className="text-gray-400 font-semibold">TechCorp Inc</div>
                <div className="text-gray-400 font-semibold">Global Audit LLC</div>
              </div>
            </div>
          </div>

          {/* Right column - Illustration space */}
          <div className="relative">
            <div className="aspect-w-4 aspect-h-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-center h-full">
                {/* Placeholder for hero illustration */}
                <div className="relative w-full h-80 bg-white rounded-xl shadow-lg p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl"></div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="w-20 h-4 bg-blue-200 rounded animate-pulse"></div>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <div className="w-8 h-8 bg-white/30 rounded-lg"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded-full w-3/4 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded-full w-1/2 animate-pulse"></div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-32 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <div className="text-white text-sm font-medium">AI Analysis</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;