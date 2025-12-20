import React from 'react';
import { BookOpen, MessageSquare, TrendingUp, Clock, Plus } from 'lucide-react';
import { SUBJECTS } from '../../../shared/constants/index';

const Dashboard: React.FC = () => {
  // Mock data - in real app, this would come from API
  const recentQuestions = [
    {
      id: 1,
      subject: 'Mathematics',
      question: 'How do I solve quadratic equations?',
      timestamp: '2 hours ago',
      status: 'answered'
    },
    {
      id: 2,
      subject: 'English',
      question: 'What is the difference between active and passive voice?',
      timestamp: '1 day ago',
      status: 'answered'
    },
    {
      id: 3,
      subject: 'Biology',
      question: 'Explain the process of photosynthesis',
      timestamp: '3 days ago',
      status: 'answered'
    }
  ];

  const competencies = [
    { name: 'Critical Thinking', progress: 75, color: 'bg-blue-500' },
    { name: 'Problem Solving', progress: 60, color: 'bg-green-500' },
    { name: 'Communication', progress: 85, color: 'bg-purple-500' },
    { name: 'Research Skills', progress: 45, color: 'bg-yellow-500' }
  ];

  const subjectIcons: Record<string, string> = {
    'Mathematics': '🔢',
    'English': '📚',
    'Science': '🧪',
    'Social Studies': '🌍',
    'Geography': '🗺️',
    'History': '📜',
    'Civics': '🏛️',
    'Literature': '📖',
    'Biology': '🧬',
    'Chemistry': '⚗️',
    'Physics': '⚛️',
    'Agriculture': '🌾',
    'ICT': '💻',
    'Art': '🎨',
    'Music': '🎵',
    'Physical Education': '⚽'
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, Student!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Continue your learning journey with Aine.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Questions Asked</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Subjects Covered</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">85%</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Study Streak</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">7 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subject Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Your Subjects
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {SUBJECTS.slice(0, 12).map((subject) => (
                  <button
                    key={subject}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left group"
                  >
                    <div className="text-2xl mb-2">{subjectIcons[subject] || '📖'}</div>
                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                      {subject}
                    </h3>
                  </button>
                ))}
              </div>
              <button className="mt-4 w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" />
                Add More Subjects
              </button>
            </div>

            {/* Recent Questions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Recent Questions
              </h2>
              <div className="space-y-4">
                {recentQuestions.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                          {item.subject}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {item.question}
                      </p>
                    </div>
                    <button className="ml-4 px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors">
                      View Answer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competency Tracker */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Competency Progress
              </h2>
              <div className="space-y-4">
                {competencies.map((competency, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {competency.name}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {competency.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${competency.color} transition-all duration-300`}
                        style={{ width: `${competency.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                View Full Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;