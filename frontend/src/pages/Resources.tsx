import React, { useState } from 'react';
import { FileText, Download, ExternalLink, Search, BookOpen, GraduationCap, Award } from 'lucide-react';

const Resources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');

  const subjects = [
    'All Subjects',
    'Mathematics',
    'English',
    'Biology',
    'Chemistry',
    'Physics',
    'Geography',
    'History',
    'Religious Education'
  ];

  const grades = [
    'All Grades',
    'S1', 'S2', 'S3', 'S4', 'S5', 'S6'
  ];

  const resources = [
    {
      id: 1,
      title: 'UNEB Biology Syllabus 2023',
      subject: 'Biology',
      grade: 'S4',
      type: 'Syllabus',
      description: 'Complete syllabus for Senior 4 Biology with learning outcomes and assessment criteria.',
      downloadUrl: '#',
      fileSize: '2.3 MB',
      lastUpdated: '2023-08-15'
    },
    {
      id: 2,
      title: 'Mathematics Formula Sheet',
      subject: 'Mathematics',
      grade: 'S3',
      type: 'Study Guide',
      description: 'Essential formulas and equations for O-Level Mathematics.',
      downloadUrl: '#',
      fileSize: '1.1 MB',
      lastUpdated: '2023-09-20'
    },
    {
      id: 3,
      title: 'English Literature Analysis Guide',
      subject: 'English',
      grade: 'S4',
      type: 'Study Guide',
      description: 'How to analyze poems, novels, and plays for UNEB examinations.',
      downloadUrl: '#',
      fileSize: '3.7 MB',
      lastUpdated: '2023-07-10'
    },
    {
      id: 4,
      title: 'Chemistry Practical Guide',
      subject: 'Chemistry',
      grade: 'S4',
      type: 'Practical Guide',
      description: 'Step-by-step guide for common chemistry practical experiments.',
      downloadUrl: '#',
      fileSize: '4.2 MB',
      lastUpdated: '2023-06-05'
    },
    {
      id: 5,
      title: 'Geography Case Studies',
      subject: 'Geography',
      grade: 'S3',
      type: 'Study Guide',
      description: 'Real-world case studies for population, urbanization, and development.',
      downloadUrl: '#',
      fileSize: '2.8 MB',
      lastUpdated: '2023-08-30'
    },
    {
      id: 6,
      title: 'Physics Concept Maps',
      subject: 'Physics',
      grade: 'S4',
      type: 'Study Guide',
      description: 'Visual concept maps connecting physics topics and principles.',
      downloadUrl: '#',
      fileSize: '1.9 MB',
      lastUpdated: '2023-09-12'
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === '' || selectedSubject === 'All Subjects' || resource.subject === selectedSubject;
    const matchesGrade = selectedGrade === '' || selectedGrade === 'All Grades' || resource.grade === selectedGrade;

    return matchesSearch && matchesSubject && matchesGrade;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Syllabus':
        return <GraduationCap className="h-5 w-5 text-blue-500" />;
      case 'Study Guide':
        return <BookOpen className="h-5 w-5 text-green-500" />;
      case 'Practical Guide':
        return <Award className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Syllabus':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Study Guide':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Practical Guide':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Study Resources
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Access UNEB syllabi, study guides, and learning materials.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>

              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getTypeIcon(resource.type)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                    {resource.type}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <ExternalLink className="h-5 w-5" />
                </button>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {resource.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {resource.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>{resource.subject} • {resource.grade}</span>
                <span>{resource.fileSize}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Updated {new Date(resource.lastUpdated).toLocaleDateString()}
                </span>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No resources found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Additional Resources Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                UNEB Official Website
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Access official syllabi, past papers, and examination guidelines.
              </p>
              <a
                href="https://uneb.ac.ug"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
              >
                Visit UNEB Website →
              </a>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                NCDC Curriculum Resources
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Download curriculum frameworks and teaching guides.
              </p>
              <a
                href="https://ncdc.go.ug"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
              >
                Visit NCDC Website →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;