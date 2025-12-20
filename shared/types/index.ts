// Shared TypeScript types for Aine Learning Aid

export interface User {
  id: number;
  email: string;
  full_name: string;
  grade_level: string;
  subjects: string[];
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: number;
  title: string;
  subject: string;
  grade_level: string;
  content: any; // JSON structured content
  competencies: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_time: number;
  created_by?: number;
  created_at: string;
}

export interface Assessment {
  id: number;
  lesson_id: number;
  title: string;
  type: 'quiz' | 'practical' | 'essay';
  questions: any[]; // JSON array of questions
  rubric?: any;
  time_limit?: number;
  created_at: string;
}

export interface UserProgress {
  id: number;
  user_id: number;
  lesson_id: number;
  assessment_id?: number;
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
  completed_at?: string;
  notes?: string;
}

export interface AIInteraction {
  id: number;
  user_id: number;
  type: 'content_generation' | 'question_answer' | 'image_generation';
  prompt: string;
  response?: string;
  tokens_used?: number;
  created_at: string;
}

// AI Answering Engine Types
export interface Question {
  id: number;
  user_id: number;
  subject: Subject;
  question_type: QuestionType;
  content: string;
  grade_level: string;
  competencies: string[];
  context?: string;
  created_at: string;
}

export interface Answer {
  id: number;
  question_id: number;
  user_id: number;
  content: CBAResponse;
  tokens_used: number;
  processing_time: number;
  created_at: string;
}

export interface CBAResponse {
  introduction: string;
  elaboration: string;
  conclusion: string;
  competencies_addressed: string[];
  references?: string[];
}

export type Subject =
  | 'Mathematics'
  | 'English'
  | 'Kiswahili'
  | 'Science'
  | 'Biology'
  | 'Chemistry'
  | 'Physics'
  | 'Agriculture'
  | 'Social Studies'
  | 'Geography'
  | 'History'
  | 'Civics'
  | 'Religious Education'
  | 'Literature in English'
  | 'Literature'
  | 'Art and Technology'
  | 'Art'
  | 'Music'
  | 'Performing Arts'
  | 'Physical Education'
  | 'ICT'
  | 'Entrepreneurship'
  | 'Home Economics'
  | 'Technical Drawing'
  | 'Woodwork'
  | 'Metalwork'
  | 'Tailoring and Textiles'
  | 'Foods and Nutrition'
  | 'French'
  | 'Arabic'
  | 'Luganda'
  | 'Other';

export type QuestionType =
  | 'factual'
  | 'analytical'
  | 'practical'
  | 'application'
  | 'evaluation'
  | 'synthesis';

export interface Template {
  subject: Subject;
  question_types: QuestionType[];
  prompt_template: string;
  competencies: string[];
  grade_levels: string[];
}

export interface QuestionAnalysis {
  subject: Subject;
  question_type: QuestionType;
  competencies: string[];
  grade_level: string;
  keywords: string[];
  complexity: 'low' | 'medium' | 'high';
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  grade_level: string;
  subjects: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}