import React from 'react';
import { Shield, BarChart, Clock, Lock } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: 'Automated Compliance Checks',
      description: 'Continuously monitor and verify compliance across all systems with intelligent automation and real-time alerts.'
    },
    {
      icon: BarChart,
      title: 'Real-time Reporting',
      description: 'Generate comprehensive audit reports instantly with actionable insights and customizable dashboards.'
    },
    {
      icon: Lock,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with end-to-end encryption, ensuring your sensitive data is always protected.'
    },
    {
      icon: Clock,
      title: 'Time-Saving Automation',
      description: 'Reduce manual audit work by up to 80% with AI-powered analysis and automated workflow management.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Auditing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your audit processes with cutting-edge AI technology designed 
            for accuracy, efficiency, and compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-xl p-8 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;