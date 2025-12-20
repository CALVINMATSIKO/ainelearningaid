import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'bg-primary-500',
  size = 'md',
  showPercentage = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${sizeClasses[size]} ${className}`}>
      <div
        className={`h-full ${color} rounded-full transition-all duration-300 ease-out`}
        style={{ width: `${clampedProgress}%` }}
      />
      {showPercentage && (
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-right">
          {clampedProgress}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;