import React, { useState, useMemo } from 'react';
import { Subject } from '../../../../shared/types/index';
import { SUBJECTS, SUBJECT_CATEGORIES, SUBJECT_METADATA } from '../../../../shared/constants/index';
import SubjectCard from './SubjectCard';

interface SubjectSelectorProps {
  selectedSubject: Subject | '';
  onSubjectSelect: (subject: Subject) => void;
  selectedGrade: string;
  className?: string;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  selectedSubject,
  onSubjectSelect,
  selectedGrade,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    core: true,
    science: true,
    humanities: false,
    arts: false,
    vocational: false,
    language: false,
    other: false
  });

  // Filter subjects based on grade level, search, and category
  const filteredSubjects = useMemo(() => {
    return SUBJECTS.filter(subject => {
      const metadata = SUBJECT_METADATA[subject];

      // Filter by grade level
      if (selectedGrade && metadata && !metadata.educationLevels.includes(selectedGrade)) {
        return false;
      }

      // Filter by search term
      if (searchTerm && !subject.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filter by category
      if (selectedCategory !== 'all') {
        const categorySubjects = SUBJECT_CATEGORIES[selectedCategory as keyof typeof SUBJECT_CATEGORIES] || [];
        if (!categorySubjects.includes(subject)) {
          return false;
        }
      }

      return true;
    });
  }, [selectedGrade, searchTerm, selectedCategory]);

  // Group subjects by category
  const groupedSubjects = useMemo(() => {
    const groups: Record<string, Subject[]> = {};

    Object.keys(SUBJECT_CATEGORIES).forEach(category => {
      groups[category] = filteredSubjects.filter(subject =>
        SUBJECT_CATEGORIES[category as keyof typeof SUBJECT_CATEGORIES].includes(subject as Subject)
      ) as Subject[];
    });

    return groups;
  }, [filteredSubjects]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getCategoryDisplayName = (category: string) => {
    const names = {
      core: 'Core Subjects',
      science: 'Science Subjects',
      humanities: 'Humanities & Social Sciences',
      arts: 'Creative Arts & Physical Education',
      vocational: 'Technology & Vocational',
      language: 'Languages',
      other: 'Other'
    };
    return names[category as keyof typeof names] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      core: '📚',
      science: '🧪',
      humanities: '🌍',
      arts: '🎨',
      vocational: '💼',
      language: '🗣️',
      other: '📖'
    };
    return icons[category as keyof typeof icons] || '📖';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔽</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
          >
            <option value="all">All Categories</option>
            {Object.keys(SUBJECT_CATEGORIES).map(category => (
              <option key={category} value={category}>
                {getCategoryDisplayName(category)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subject Categories */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {Object.entries(groupedSubjects).map(([category, subjects]) => {
          if (subjects.length === 0) return null;

          const isExpanded = expandedCategories[category];
          const categoryName = getCategoryDisplayName(category);
          const categoryIcon = getCategoryIcon(category);

          return (
            <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-t-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryIcon}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {categoryName}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({subjects.length})
                  </span>
                </div>
                {isExpanded ? (
                  <span className="text-gray-500">▲</span>
                ) : (
                  <span className="text-gray-500">▼</span>
                )}
              </button>

              {isExpanded && (
                <div className="p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {subjects.map(subject => (
                      <SubjectCard
                        key={subject}
                        subject={subject}
                        isSelected={selectedSubject === subject}
                        onClick={() => onSubjectSelect(subject as Subject)}
                        showDifficulty={true}
                        className="text-xs"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Popular/Recent Subjects Suggestion */}
      {selectedGrade && !selectedSubject && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Popular Subjects for {selectedGrade}
          </h4>
          <div className="flex flex-wrap gap-2">
            {filteredSubjects.slice(0, 6).map(subject => (
              <button
                key={subject}
                onClick={() => onSubjectSelect(subject as Subject)}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {filteredSubjects.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No subjects found matching your criteria.</p>
          <p className="text-sm mt-1">Try adjusting your search or filter settings.</p>
        </div>
      )}
    </div>
  );
};

export default SubjectSelector;
