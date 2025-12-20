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

export const ASSESSMENT_TYPES = ['quiz', 'practical', 'essay'];

export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];

export const AI_INTERACTION_TYPES = ['content_generation', 'question_answer', 'image_generation'];

export const PROGRESS_STATUSES = ['not_started', 'in_progress', 'completed'];

export const SUBJECT_METADATA = {
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
  }
};

export const SUBJECT_CATEGORIES = {
  core: ['Mathematics', 'English', 'Kiswahili'],
  science: ['Science', 'Biology', 'Chemistry', 'Physics', 'Agriculture'],
  humanities: ['Social Studies', 'Geography', 'History', 'Civics', 'Religious Education', 'Literature in English'],
  arts: ['Art and Technology', 'Art', 'Music', 'Performing Arts', 'Physical Education'],
  vocational: ['ICT', 'Entrepreneurship', 'Home Economics', 'Technical Drawing', 'Woodwork', 'Metalwork', 'Tailoring and Textiles', 'Foods and Nutrition'],
  language: ['French', 'Arabic', 'Luganda'],
  other: ['Other']
};

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
};