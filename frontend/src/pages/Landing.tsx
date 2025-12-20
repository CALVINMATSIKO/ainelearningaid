import React, { useState } from 'react';
import { ArrowRight, BookOpen, Target, Users, Zap } from 'lucide-react';

const Landing: React.FC = () => {
  const [question, setQuestion] = useState('');

  const features = [
    {
      icon: BookOpen,
      title: 'Curriculum-Aligned',
      description: 'Questions and answers follow UNEB CBA standards for Ugandan education.'
    },
    {
      icon: Target,
      title: 'Competency-Based',
      description: 'Focus on developing practical skills and real-world application.'
    },
    {
      icon: Zap,
      title: 'AI-Powered',
      description: 'Get instant, accurate responses powered by advanced AI technology.'
    },
    {
      icon: Users,
      title: 'Student-Focused',
      description: 'Designed specifically for Ugandan students from P1 to S6.'
    }
  ];

  const steps = [
    {
      step: '1',
      title: 'Ask Your Question',
      description: 'Type your question in simple English or Luganda.'
    },
    {
      step: '2',
      title: 'Select Subject & Level',
      description: 'Choose your subject and grade level for accurate responses.'
    },
    {
      step: '3',
      title: 'Get CBA Answer',
      description: 'Receive structured answers with competencies and references.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      // Navigate to question page with the question
      console.log('Question submitted:', question);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-secondary-300">Aine</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Your AI-powered learning companion for Ugandan education.
              Get instant answers to your questions with CBA-structured responses.
            </p>

            {/* Quick Question Input */}
            <div className="max-w-2xl mx-auto mb-8">
              <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask me anything about your subjects..."
                  className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-400"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-secondary-600 hover:bg-secondary-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  Ask Aine
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>
            </div>

            <p className="text-primary-200 text-sm">
              Try: "Explain photosynthesis" or "What is democracy?"
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Aine?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Built specifically for Ugandan students with our national curriculum in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700 hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Get answers in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-xl font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of Ugandan students using Aine to excel in their studies.
          </p>
          <button className="px-8 py-4 bg-white text-primary-600 hover:bg-gray-100 rounded-lg font-semibold text-lg transition-colors">
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Landing;