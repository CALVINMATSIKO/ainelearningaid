import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Target, ExternalLink, Share2, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';
import { CBAResponse } from '../../../shared/types/index';

const Answer: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState({
    introduction: true,
    elaboration: true,
    conclusion: false,
    competencies: false,
    references: false
  });

  // Mock CBA response data
  const mockResponse: CBAResponse = {
    introduction: "Photosynthesis is a vital biological process that converts light energy into chemical energy, enabling plants and some microorganisms to produce their own food. This process is fundamental to life on Earth as it forms the basis of most food chains and maintains atmospheric oxygen levels.",
    elaboration: "The process of photosynthesis occurs primarily in the chloroplasts of plant cells, specifically in structures called thylakoids. It can be summarized by the equation: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. The process involves two main stages: the light-dependent reactions and the light-independent reactions (Calvin cycle). During light-dependent reactions, chlorophyll absorbs light energy, which is used to split water molecules, releasing oxygen and producing ATP and NADPH. These energy carriers then power the Calvin cycle, where carbon dioxide is fixed into glucose through a series of enzymatic reactions.",
    conclusion: "Understanding photosynthesis is crucial for appreciating how energy flows through ecosystems. It demonstrates the interconnectedness of biological processes and highlights the importance of plants in maintaining environmental balance. Students should be able to explain both the chemical equation and the step-by-step process of energy conversion.",
    competencies_addressed: [
      "Scientific inquiry and problem-solving",
      "Application of scientific knowledge",
      "Critical thinking and analysis",
      "Communication of scientific ideas"
    ],
    references: [
      "UNEB Biology Syllabus 2023 - Topic 4.1: Nutrition in Plants",
      "Campbell Biology (11th Edition) - Chapter 10: Photosynthesis",
      "Uganda National Curriculum - Senior 4 Biology"
    ]
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderSection = (
    title: string,
    content: string | string[],
    sectionKey: keyof typeof expandedSections,
    icon: React.ReactNode
  ) => {
    const isExpanded = expandedSections[sectionKey];

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            {icon}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {isExpanded && (
          <div className="px-6 pb-6">
            {Array.isArray(content) ? (
              <ul className="space-y-2">
                {content.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary-500 mt-1">•</span>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {content}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Your Question
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                "Explain the process of photosynthesis in plants"
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium">
                Biology - S4
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <RotateCcw className="h-4 w-4" />
              Ask Similar
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-500 dark:text-gray-400">Was this helpful?</span>
              <button className="p-1 text-gray-400 hover:text-green-500 transition-colors">
                <ThumbsUp className="h-5 w-5" />
              </button>
              <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                <ThumbsDown className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* CBA Response Sections */}
        <div className="space-y-6">
          {renderSection(
            "Introduction",
            mockResponse.introduction,
            "introduction",
            <BookOpen className="h-5 w-5 text-blue-500" />
          )}

          {renderSection(
            "Detailed Explanation",
            mockResponse.elaboration,
            "elaboration",
            <Target className="h-5 w-5 text-green-500" />
          )}

          {renderSection(
            "Conclusion",
            mockResponse.conclusion,
            "conclusion",
            <BookOpen className="h-5 w-5 text-purple-500" />
          )}

          {renderSection(
            "Competencies Addressed",
            mockResponse.competencies_addressed,
            "competencies",
            <Target className="h-5 w-5 text-yellow-500" />
          )}

          {renderSection(
            "References & Resources",
            mockResponse.references || [],
            "references",
            <ExternalLink className="h-5 w-5 text-indigo-500" />
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Response generated in 2.3 seconds • AI Model: Groq
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
              Save to Notes
            </button>
            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
              Ask Another Question
            </button>
          </div>
        </div>

        {/* Related Questions */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Related Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "What is the role of chlorophyll in photosynthesis?",
              "How does light intensity affect photosynthesis?",
              "Compare photosynthesis and respiration",
              "What factors limit the rate of photosynthesis?"
            ].map((question, index) => (
              <button
                key={index}
                className="p-4 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {question}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Answer;