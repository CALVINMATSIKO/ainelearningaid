import React, { useState } from 'react';
import { Send, FileText, Image, Mic } from 'lucide-react';
import { GRADE_LEVELS } from '../../../shared/constants/index';
import { Subject, QuestionType } from '../../../shared/types/index';
import { useApp } from '../contexts/AppContext';
import SubjectSelector from '../components/ui/SubjectSelector';
import ImageGenerator from '../components/ImageGenerator';

const Question: React.FC = () => {
  const { submitQuestion, state, toggleImageGeneration } = useApp();
  const [question, setQuestion] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | ''>('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [questionType, setQuestionType] = useState<QuestionType | ''>('');
  const [context, setContext] = useState('');

  const questionTypes: { value: QuestionType; label: string; description: string }[] = [
    { value: 'factual', label: 'Factual', description: 'What, when, where questions' },
    { value: 'analytical', label: 'Analytical', description: 'Why, how questions' },
    { value: 'practical', label: 'Practical', description: 'Hands-on, application questions' },
    { value: 'application', label: 'Application', description: 'Real-world scenarios' },
    { value: 'evaluation', label: 'Evaluation', description: 'Judgment, assessment questions' },
    { value: 'synthesis', label: 'Synthesis', description: 'Combining ideas, creating new solutions' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !selectedSubject || !selectedGrade || !questionType) {
      return;
    }

    await submitQuestion({
      content: question,
      subject: selectedSubject,
      question_type: questionType,
      grade_level: selectedGrade,
      context: context || undefined,
    });

    // Navigate to answer page (in a real app with routing)
    // For now, we'll stay on the same page
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Ask Your Question
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get detailed, curriculum-aligned answers from Aine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question Input */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Question *
                </label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question here... (e.g., 'Explain the water cycle' or 'How do I solve quadratic equations?')"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  rows={4}
                  required
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Attach file"
                    >
                      <FileText className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Attach image"
                    >
                      <Image className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Voice input"
                    >
                      <Mic className="h-5 w-5" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {question.length}/1000
                  </span>
                </div>
              </div>

              {/* Grade Level Selection */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Grade Level *
                </label>
                <select
                  id="grade"
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select grade level</option>
                  {GRADE_LEVELS.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Selection */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Subject *
                </label>
                <SubjectSelector
                  selectedSubject={selectedSubject}
                  onSubjectSelect={setSelectedSubject}
                  selectedGrade={selectedGrade}
                />
              </div>

              {/* Question Type */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Question Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {questionTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        questionType === type.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="questionType"
                        value={type.value}
                        checked={questionType === type.value}
                        onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                        className="sr-only"
                        required
                      />
                      <div className="text-center">
                        <div className="font-medium text-gray-900 dark:text-white mb-1">
                          {type.label}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {type.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Context */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <label htmlFor="context" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Context (Optional)
                </label>
                <textarea
                  id="context"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Provide any additional context, specific requirements, or background information..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  rows={3}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  This helps Aine provide more accurate and relevant answers.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={state.isLoading || !question.trim() || !selectedSubject || !selectedGrade || !questionType}
                  className="px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
                >
                  {state.isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Ask Aine
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Image Generator */}
            {state.imageGenerationEnabled && (
              <div className="mt-8">
                <ImageGenerator
                  prompt={question}
                  subject={selectedSubject}
                  disabled={!question.trim() || !selectedSubject}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tips for Better Answers
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">•</span>
                  Be specific about what you want to know
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">•</span>
                  Include relevant context or examples
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">•</span>
                  Choose the correct question type for better formatting
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">•</span>
                  Answers follow UNEB CBA standards
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-6 border border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                CBA Response Format
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Your answers will include:
              </p>
              <ul className="text-sm text-blue-800 dark:text-blue-200 mt-2 space-y-1">
                <li>• Introduction</li>
                <li>• Detailed explanation</li>
                <li>• Conclusion</li>
                <li>• Key competencies addressed</li>
                <li>• UNEB references</li>
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Visual Aid Settings
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Enable Image Generation</span>
                <button
                  onClick={toggleImageGeneration}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    state.imageGenerationEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      state.imageGenerationEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;