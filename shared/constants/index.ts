// Shared constants for Aine Learning Aid

export const GRADE_LEVELS = [
  'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7',
  'S1', 'S2', 'S3', 'S4', 'S5', 'S6'
];

export const SUBJECTS = [
  // Core Subjects
  'Mathematics',
  'English',
  'Kiswahili',

  // Sciences
  'Science',
  'Biology',
  'Chemistry',
  'Physics',
  'Agriculture',

  // Humanities and Social Sciences
  'Social Studies',
  'Geography',
  'History',
  'Civics',
  'Religious Education',
  'Literature in English',
  'Literature',

  // Creative Arts
  'Art and Technology',
  'Art',
  'Music',
  'Performing Arts',

  // Physical Education and Health
  'Physical Education',

  // Technology and Vocational
  'ICT',
  'Entrepreneurship',
  'Home Economics',
  'Technical Drawing',
  'Woodwork',
  'Metalwork',
  'Tailoring and Textiles',
  'Foods and Nutrition',

  // Languages
  'French',
  'Arabic',
  'Luganda',

  // Other
  'Other'
];

export const ASSESSMENT_TYPES = ['quiz', 'practical', 'essay'] as const;

export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;

export const AI_INTERACTION_TYPES = ['content_generation', 'question_answer', 'image_generation'] as const;

export const PROGRESS_STATUSES = ['not_started', 'in_progress', 'completed'] as const;

// Subject metadata for enhanced subject handling
export interface SubjectMetadata {
  name: string;
  category: 'core' | 'science' | 'humanities' | 'arts' | 'vocational' | 'language' | 'other';
  educationLevels: string[]; // Applicable grade levels
  description: string;
  learningObjectives: string[];
  icon: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  competencies: string[];
  unebSyllabusRef?: string;
  samplePaperStructure?: string[];
}

export const SUBJECT_METADATA: Record<string, SubjectMetadata> = {
  'Mathematics': {
    name: 'Mathematics',
    category: 'core',
    educationLevels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
    description: 'The study of numbers, shapes, patterns, and logical reasoning',
    learningObjectives: [
      'Develop numerical fluency and problem-solving skills',
      'Understand mathematical concepts and their applications',
      'Apply mathematical reasoning to real-world situations',
      'Communicate mathematical ideas effectively'
    ],
    icon: '🔢',
    difficulty: 'intermediate',
    competencies: [
      'Apply mathematical concepts to solve problems',
      'Use mathematical tools and representations',
      'Reason logically and critically',
      'Communicate mathematical thinking'
    ],
    unebSyllabusRef: 'UNEB Mathematics Syllabus 2023',
    samplePaperStructure: ['Multiple Choice', 'Structured Questions', 'Extended Response']
  },
  'English': {
    name: 'English',
    category: 'core',
    educationLevels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
    description: 'Language arts focusing on reading, writing, speaking, and listening skills',
    learningObjectives: [
      'Develop effective communication skills',
      'Understand and analyze various texts',
      'Write clearly and coherently',
      'Appreciate literature and language diversity'
    ],
    icon: '📚',
    difficulty: 'intermediate',
    competencies: [
      'Read and comprehend various texts',
      'Write effectively for different purposes',
      'Speak and listen actively',
      'Use grammar and vocabulary appropriately'
    ],
    unebSyllabusRef: 'UNEB English Syllabus 2023',
    samplePaperStructure: ['Comprehension', 'Summary', 'Composition', 'Grammar']
  },
  'Kiswahili': {
    name: 'Kiswahili',
    category: 'language',
    educationLevels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'S1', 'S2', 'S3', 'S4'],
    description: 'Swahili language focusing on communication and cultural understanding',
    learningObjectives: [
      'Develop proficiency in Kiswahili language',
      'Understand East African culture and literature',
      'Communicate effectively in Kiswahili',
      'Appreciate linguistic diversity'
    ],
    icon: '🗣️',
    difficulty: 'intermediate',
    competencies: [
      'Understand spoken and written Kiswahili',
      'Express ideas clearly in Kiswahili',
      'Analyze Kiswahili literature',
      'Use Kiswahili in various contexts'
    ],
    unebSyllabusRef: 'UNEB Kiswahili Syllabus 2023'
  },
  'Science': {
    name: 'Science',
    category: 'science',
    educationLevels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'],
    description: 'Integrated study of biology, chemistry, and physics concepts',
    learningObjectives: [
      'Understand basic scientific concepts',
      'Develop inquiry and investigation skills',
      'Apply scientific methods to solve problems',
      'Appreciate the role of science in society'
    ],
    icon: '🧪',
    difficulty: 'basic',
    competencies: [
      'Conduct simple investigations',
      'Analyze and interpret data',
      'Understand scientific concepts',
      'Apply science to everyday situations'
    ]
  },
  'Biology': {
    name: 'Biology',
    category: 'science',
    educationLevels: ['S1', 'S2', 'S3', 'S4'],
    description: 'Study of living organisms and life processes',
    learningObjectives: [
      'Understand biological systems and processes',
      'Develop practical laboratory skills',
      'Apply biological knowledge to real-world issues',
      'Appreciate biodiversity and conservation'
    ],
    icon: '🧬',
    difficulty: 'advanced',
    competencies: [
      'Conduct biological investigations',
      'Analyze biological data and evidence',
      'Understand biological systems',
      'Apply biological knowledge to solve problems'
    ],
    unebSyllabusRef: 'UNEB Biology Syllabus 2023',
    samplePaperStructure: ['Multiple Choice', 'Structured Questions', 'Practical Paper', 'Essay Questions']
  },
  'Chemistry': {
    name: 'Chemistry',
    category: 'science',
    educationLevels: ['S2', 'S3', 'S4'],
    description: 'Study of matter, its properties, and transformations',
    learningObjectives: [
      'Understand chemical principles and reactions',
      'Develop laboratory and analytical skills',
      'Apply chemistry to industrial and environmental contexts',
      'Solve chemical problems systematically'
    ],
    icon: '⚗️',
    difficulty: 'advanced',
    competencies: [
      'Conduct chemical investigations',
      'Analyze chemical data',
      'Understand chemical systems',
      'Apply chemical knowledge to solve problems'
    ],
    unebSyllabusRef: 'UNEB Chemistry Syllabus 2023',
    samplePaperStructure: ['Multiple Choice', 'Structured Questions', 'Practical Paper', 'Calculations']
  },
  'Physics': {
    name: 'Physics',
    category: 'science',
    educationLevels: ['S2', 'S3', 'S4'],
    description: 'Study of matter, energy, and their interactions',
    learningObjectives: [
      'Understand physical principles and laws',
      'Develop experimental and analytical skills',
      'Apply physics to technological applications',
      'Solve physics problems using mathematical methods'
    ],
    icon: '⚛️',
    difficulty: 'advanced',
    competencies: [
      'Conduct physics investigations',
      'Analyze physical data',
      'Understand physical systems',
      'Apply physics knowledge to solve problems'
    ],
    unebSyllabusRef: 'UNEB Physics Syllabus 2023',
    samplePaperStructure: ['Multiple Choice', 'Structured Questions', 'Practical Paper', 'Calculations']
  },
  'History': {
    name: 'History',
    category: 'humanities',
    educationLevels: ['S1', 'S2', 'S3', 'S4'],
    description: 'Study of past events, societies, and human development',
    learningObjectives: [
      'Understand historical events and their causes',
      'Develop critical thinking about historical sources',
      'Appreciate cultural diversity and heritage',
      'Connect past events to present situations'
    ],
    icon: '📜',
    difficulty: 'intermediate',
    competencies: [
      'Analyze historical sources',
      'Understand historical contexts',
      'Evaluate historical interpretations',
      'Communicate historical knowledge'
    ],
    unebSyllabusRef: 'UNEB History Syllabus 2023',
    samplePaperStructure: ['Multiple Choice', 'Source-based Questions', 'Essay Questions']
  },
  'Geography': {
    name: 'Geography',
    category: 'humanities',
    educationLevels: ['S1', 'S2', 'S3', 'S4'],
    description: 'Study of Earth\'s physical and human features',
    learningObjectives: [
      'Understand physical and human geography',
      'Develop map reading and spatial skills',
      'Analyze geographical data and patterns',
      'Appreciate environmental and social issues'
    ],
    icon: '🗺️',
    difficulty: 'intermediate',
    competencies: [
      'Interpret geographical data',
      'Understand geographical processes',
      'Analyze spatial patterns',
      'Apply geographical knowledge to issues'
    ],
    unebSyllabusRef: 'UNEB Geography Syllabus 2023',
    samplePaperStructure: ['Multiple Choice', 'Map Work', 'Data Response', 'Essay Questions']
  },
  'Entrepreneurship': {
    name: 'Entrepreneurship',
    category: 'vocational',
    educationLevels: ['S3', 'S4'],
    description: 'Study of business creation and management',
    learningObjectives: [
      'Understand business principles and practices',
      'Develop entrepreneurial skills',
      'Create and manage small businesses',
      'Appreciate economic development'
    ],
    icon: '💼',
    difficulty: 'intermediate',
    competencies: [
      'Develop business plans',
      'Understand financial management',
      'Apply entrepreneurial skills',
      'Solve business problems'
    ],
    unebSyllabusRef: 'UNEB Entrepreneurship Syllabus 2023'
  },
  'ICT': {
    name: 'ICT',
    category: 'vocational',
    educationLevels: ['S1', 'S2', 'S3', 'S4'],
    description: 'Information and Communication Technology skills',
    learningObjectives: [
      'Develop computer literacy and digital skills',
      'Understand ICT applications in various fields',
      'Create digital content and solutions',
      'Appreciate ethical use of technology'
    ],
    icon: '💻',
    difficulty: 'intermediate',
    competencies: [
      'Use ICT tools effectively',
      'Create digital content',
      'Solve problems using technology',
      'Understand ICT ethics and security'
    ],
    unebSyllabusRef: 'UNEB ICT Syllabus 2023'
  },
  'Physical Education': {
    name: 'Physical Education',
    category: 'arts',
    educationLevels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'S1', 'S2', 'S3', 'S4'],
    description: 'Physical activities and health education',
    learningObjectives: [
      'Develop physical fitness and motor skills',
      'Understand health and wellness principles',
      'Participate in various physical activities',
      'Appreciate sportsmanship and teamwork'
    ],
    icon: '⚽',
    difficulty: 'basic',
    competencies: [
      'Perform physical activities',
      'Understand health concepts',
      'Demonstrate sportsmanship',
      'Apply fitness principles'
    ]
  },
  'Agriculture': {
    name: 'Agriculture',
    category: 'science',
    educationLevels: ['S1', 'S2', 'S3', 'S4'],
    description: 'Study of crop and animal production',
    learningObjectives: [
      'Understand agricultural principles and practices',
      'Develop practical farming skills',
      'Apply sustainable agriculture methods',
      'Appreciate food security issues'
    ],
    icon: '🌾',
    difficulty: 'intermediate',
    competencies: [
      'Conduct agricultural investigations',
      'Apply farming techniques',
      'Understand agricultural systems',
      'Solve agricultural problems'
    ],
    unebSyllabusRef: 'UNEB Agriculture Syllabus 2023',
    samplePaperStructure: ['Multiple Choice', 'Structured Questions', 'Practical Paper']
  }
};

// Subject categories for UI organization
export const SUBJECT_CATEGORIES = {
  core: ['Mathematics', 'English', 'Kiswahili'],
  science: ['Science', 'Biology', 'Chemistry', 'Physics', 'Agriculture'],
  humanities: ['Social Studies', 'Geography', 'History', 'Civics', 'Religious Education', 'Literature in English'],
  arts: ['Art and Technology', 'Art', 'Music', 'Performing Arts', 'Physical Education'],
  vocational: ['ICT', 'Entrepreneurship', 'Home Economics', 'Technical Drawing', 'Woodwork', 'Metalwork', 'Tailoring and Textiles', 'Foods and Nutrition'],
  language: ['French', 'Arabic', 'Luganda'],
  other: ['Other']
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me'
  },
  USERS: '/users',
  LESSONS: '/lessons',
  ASSESSMENTS: '/assessments',
  AI: {
    GENERATE_CONTENT: '/ai/generate-content',
    ANSWER_QUESTION: '/ai/answer-question',
    GENERATE_IMAGE: '/ai/generate-image'
  }
} as const;