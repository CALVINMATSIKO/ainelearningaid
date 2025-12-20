import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Question, Answer } from '../../../shared/types/index';

interface AppState {
  questions: Question[];
  currentQuestion: Question | null;
  currentAnswer: Answer | null;
  isLoading: boolean;
  error: string | null;
  imageGenerationEnabled: boolean;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_QUESTIONS'; payload: Question[] }
  | { type: 'ADD_QUESTION'; payload: Question }
  | { type: 'SET_CURRENT_QUESTION'; payload: Question | null }
  | { type: 'SET_CURRENT_ANSWER'; payload: Answer | null }
  | { type: 'CLEAR_CURRENT' }
  | { type: 'TOGGLE_IMAGE_GENERATION' };

const initialState: AppState = {
  questions: [],
  currentQuestion: null,
  currentAnswer: null,
  isLoading: false,
  error: null,
  imageGenerationEnabled: localStorage.getItem('imageGenerationEnabled') !== 'false', // Default to true
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload };
    case 'ADD_QUESTION':
      return { ...state, questions: [action.payload, ...state.questions] };
    case 'SET_CURRENT_QUESTION':
      return { ...state, currentQuestion: action.payload };
    case 'SET_CURRENT_ANSWER':
      return { ...state, currentAnswer: action.payload };
    case 'CLEAR_CURRENT':
      return { ...state, currentQuestion: null, currentAnswer: null };
    case 'TOGGLE_IMAGE_GENERATION':
      const newEnabled = !state.imageGenerationEnabled;
      localStorage.setItem('imageGenerationEnabled', newEnabled.toString());
      return { ...state, imageGenerationEnabled: newEnabled };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  submitQuestion: (questionData: any) => Promise<void>;
  loadQuestions: () => Promise<void>;
  toggleImageGeneration: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const submitQuestion = async (questionData: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Mock API call - replace with actual API service
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockQuestion: Question = {
        id: Date.now(),
        user_id: 1,
        subject: questionData.subject,
        question_type: questionData.question_type,
        content: questionData.content,
        grade_level: questionData.grade_level,
        competencies: questionData.competencies || [],
        context: questionData.context,
        created_at: new Date().toISOString(),
      };

      const mockAnswer: Answer = {
        id: Date.now(),
        question_id: mockQuestion.id,
        user_id: 1,
        content: {
          introduction: "This is a mock introduction for the answer.",
          elaboration: "This is detailed explanation content.",
          conclusion: "This is the conclusion.",
          competencies_addressed: ["Critical Thinking", "Problem Solving"],
          references: ["UNEB Syllabus 2023"]
        },
        tokens_used: 150,
        processing_time: 2.3,
        created_at: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_QUESTION', payload: mockQuestion });
      dispatch({ type: 'SET_CURRENT_QUESTION', payload: mockQuestion });
      dispatch({ type: 'SET_CURRENT_ANSWER', payload: mockAnswer });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadQuestions = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Mock data - replace with actual API call
      const mockQuestions: Question[] = [
        {
          id: 1,
          user_id: 1,
          subject: 'Mathematics',
          question_type: 'analytical',
          content: 'How do I solve quadratic equations?',
          grade_level: 'S4',
          competencies: ['Problem Solving'],
          created_at: '2023-12-01T10:00:00Z',
        },
        {
          id: 2,
          user_id: 1,
          subject: 'Biology',
          question_type: 'factual',
          content: 'Explain photosynthesis',
          grade_level: 'S4',
          competencies: ['Scientific Knowledge'],
          created_at: '2023-12-02T10:00:00Z',
        },
      ];
      dispatch({ type: 'SET_QUESTIONS', payload: mockQuestions });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load questions' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const toggleImageGeneration = () => {
    dispatch({ type: 'TOGGLE_IMAGE_GENERATION' });
  };

  const value: AppContextType = {
    state,
    dispatch,
    submitQuestion,
    loadQuestions,
    toggleImageGeneration,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};