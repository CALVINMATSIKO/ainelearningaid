import React from 'react';
import { Subject } from '../../../../shared/types/index';
import { SUBJECT_METADATA } from '../../../../shared/constants/index';

interface SubjectCardProps {
  subject: Subject;
  icon?: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  showDifficulty?: boolean;
  showDescription?: boolean;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  icon,
  isSelected = false,
  onClick,
  className = '',
  showDifficulty = false,
  showDescription = false
}) => {
  const metadata = SUBJECT_METADATA[subject];
  const displayIcon = icon || metadata?.icon || '📖';
  const difficulty = metadata?.difficulty;
  const description = metadata?.description;

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'basic': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`p-4 bg-white dark:bg-gray-800 rounded-lg border-2 transition-all hover:shadow-md ${
        isSelected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
      } ${className}`}
    >
      <div className="text-center">
        <div className="text-3xl mb-2">{displayIcon}</div>
        <h3 className={`font-medium text-sm ${
          isSelected
            ? 'text-primary-700 dark:text-primary-300'
            : 'text-gray-900 dark:text-white'
        }`}>
          {subject}
        </h3>
        {showDifficulty && difficulty && (
          <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
        )}
        {showDescription && description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </button>
  );
};

export default SubjectCard;