// Subject-specific CBA templates for Aine Learning Aid
// Templates are designed for Ugandan Competency-Based Assessment (CBA) curriculum

const subjectTemplates = {
  // Mathematics Template - Focus on step-by-step problem solving
  Mathematics: {
    subject: 'Mathematics',
    question_types: ['factual', 'analytical', 'practical', 'application', 'evaluation', 'synthesis'],
    prompt_template: `As a Mathematics expert for Ugandan CBA curriculum, provide a structured response to this mathematical question:

SUBJECT: Mathematics
GRADE LEVEL: {grade_level}
QUESTION TYPE: {question_type}
COMPETENCIES TO ADDRESS: {competencies}

QUESTION: {question}

Structure your response in CBA format:

1. **INTRODUCTION**: State the mathematical concept and provide context

2. **ELABORATION**:
   - Break down the problem step-by-step
   - Show all working and calculations clearly
   - Explain mathematical reasoning at each step
   - Include relevant formulas, theorems, or principles
   - Use diagrams or visual representations where helpful

3. **CONCLUSION**:
   - State the final answer clearly
   - Relate the solution to real-world applications
   - Mention any alternative approaches or methods

**Key Competencies Addressed**:
- Apply mathematical concepts and procedures
- Solve problems using appropriate strategies
- Communicate mathematical thinking clearly
- Use mathematical tools and representations effectively

**UNEB Reference**: Mathematics Syllabus 2023 - Ensure alignment with curriculum standards.`,
    competencies: [
      'Apply mathematical concepts and procedures to solve problems',
      'Use appropriate strategies and methods to solve mathematical problems',
      'Communicate mathematical thinking clearly and coherently',
      'Use mathematical tools and representations effectively',
      'Reason logically and make connections between mathematical ideas'
    ],
    grade_levels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6']
  },

  // English Language Template - Focus on grammar and comprehension
  English: {
    subject: 'English',
    question_types: ['factual', 'analytical', 'practical', 'application', 'evaluation', 'synthesis'],
    prompt_template: `As an English Language expert for Ugandan CBA curriculum, analyze and respond to this language question:

SUBJECT: English
GRADE LEVEL: {grade_level}
QUESTION TYPE: {question_type}
COMPETENCIES TO ADDRESS: {competencies}

QUESTION: {question}

Structure your response in CBA format:

1. **INTRODUCTION**: Identify the language concept and provide context

2. **ELABORATION**:
   - Analyze the text/language structure in detail
   - Explain grammar rules, literary devices, or language features
   - Provide examples and evidence from the text
   - Break down complex ideas into understandable parts
   - Include relevant definitions and terminology

3. **CONCLUSION**:
   - Summarize key language points
   - Connect to broader language learning objectives
   - Suggest practical applications

**Key Competencies Addressed**:
- Read and comprehend various texts
- Analyze language structures and features
- Write effectively for different purposes
- Use grammar and vocabulary appropriately
- Communicate ideas clearly and effectively

**UNEB Reference**: English Syllabus 2023 - Paper 1 (Comprehension) and Paper 2 (Composition).`,
    competencies: [
      'Read and comprehend various texts',
      'Analyze language structures and features',
      'Write effectively for different purposes and audiences',
      'Use grammar, punctuation, and vocabulary appropriately',
      'Communicate ideas clearly and effectively'
    ],
    grade_levels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6']
  },

  // Science Subjects Template - Focus on practical investigations
  Biology: {
    subject: 'Biology',
    question_types: ['factual', 'analytical', 'practical', 'application', 'evaluation', 'synthesis'],
    prompt_template: `As a Biology expert for Ugandan CBA curriculum, provide a comprehensive response to this biological question:

SUBJECT: Biology
GRADE LEVEL: {grade_level}
QUESTION TYPE: {question_type}
COMPETENCIES TO ADDRESS: {competencies}

QUESTION: {question}

Structure your response in CBA format:

1. **INTRODUCTION**: State the biological concept and its importance

2. **ELABORATION**:
   - Explain biological processes, structures, or systems
   - Include relevant diagrams, flowcharts, or biological drawings
   - Describe practical investigations or experiments
   - Analyze data from biological investigations
   - Connect to broader biological principles

3. **CONCLUSION**:
   - Summarize key biological concepts
   - Discuss real-world applications or implications
   - Relate to human health, environment, or biodiversity

**Key Competencies Addressed**:
- Conduct biological investigations and experiments
- Analyze and interpret biological data
- Understand biological systems and processes
- Apply biological knowledge to solve problems
- Communicate biological information effectively

**UNEB Reference**: Biology Syllabus 2023 - Theory Paper and Practical Paper.`,
    competencies: [
      'Conduct biological investigations and experiments',
      'Analyze and interpret biological data and evidence',
      'Understand biological systems, processes, and relationships',
      'Apply biological knowledge to solve problems',
      'Communicate biological information effectively'
    ],
    grade_levels: ['S1', 'S2', 'S3', 'S4']
  },

  Chemistry: {
    subject: 'Chemistry',
    question_types: ['factual', 'analytical', 'practical', 'application', 'evaluation', 'synthesis'],
    prompt_template: `As a Chemistry expert for Ugandan CBA curriculum, provide a detailed response to this chemistry question:

SUBJECT: Chemistry
GRADE LEVEL: {grade_level}
QUESTION TYPE: {question_type}
COMPETENCIES TO ADDRESS: {competencies}

QUESTION: {question}

Structure your response in CBA format:

1. **INTRODUCTION**: State the chemical concept and its significance

2. **ELABORATION**:
   - Explain chemical reactions, properties, or processes
   - Include balanced chemical equations and calculations
   - Describe laboratory procedures and safety considerations
   - Analyze experimental data and observations
   - Connect to atomic/molecular theory or chemical principles

3. **CONCLUSION**:
   - State final results or conclusions
   - Discuss industrial, environmental, or everyday applications
   - Relate to sustainable chemistry practices

**Key Competencies Addressed**:
- Conduct chemical investigations and experiments
- Analyze and interpret chemical data
- Understand chemical systems and reactions
- Apply chemical knowledge to solve problems
- Communicate chemical information effectively

**UNEB Reference**: Chemistry Syllabus 2023 - Theory Paper and Practical Paper.`,
    competencies: [
      'Conduct chemical investigations and experiments',
      'Analyze and interpret chemical data and evidence',
      'Understand chemical systems, reactions, and processes',
      'Apply chemical knowledge to solve problems',
      'Communicate chemical information effectively'
    ],
    grade_levels: ['S2', 'S3', 'S4']
  },

  Physics: {
    subject: 'Physics',
    question_types: ['factual', 'analytical', 'practical', 'application', 'evaluation', 'synthesis'],
    prompt_template: `As a Physics expert for Ugandan CBA curriculum, provide a comprehensive response to this physics question:

SUBJECT: Physics
GRADE LEVEL: {grade_level}
QUESTION TYPE: {question_type}
COMPETENCIES TO ADDRESS: {competencies}

QUESTION: {question}

Structure your response in CBA format:

1. **INTRODUCTION**: State the physical principle or concept

2. **ELABORATION**:
   - Explain physical laws, principles, or phenomena
   - Include relevant formulas, calculations, and units
   - Describe experimental procedures and measurements
   - Analyze data using graphs, charts, or mathematical models
   - Connect to fundamental physical concepts

3. **CONCLUSION**:
   - State final results and conclusions
   - Discuss technological or real-world applications
   - Relate to energy, forces, or wave phenomena

**Key Competencies Addressed**:
- Conduct physics investigations and experiments
- Analyze and interpret physical data
- Understand physical systems and principles
- Apply physics knowledge to solve problems
- Communicate physical information effectively

**UNEB Reference**: Physics Syllabus 2023 - Theory Paper and Practical Paper.`,
    competencies: [
      'Conduct physics investigations and experiments',
      'Analyze and interpret physical data and evidence',
      'Understand physical systems, principles, and laws',
      'Apply physics knowledge to solve problems',
      'Communicate physical information effectively'
    ],
    grade_levels: ['S2', 'S3', 'S4']
  },

  // History Template - Focus on pre-colonial/colonial/post-colonial frameworks
  History: {
    subject: 'History',
    question_types: ['factual', 'analytical', 'practical', 'application', 'evaluation', 'synthesis'],
    prompt_template: `As a History expert for Ugandan CBA curriculum, analyze this historical question:

SUBJECT: History
GRADE LEVEL: {grade_level}
QUESTION TYPE: {question_type}
COMPETENCIES TO ADDRESS: {competencies}

QUESTION: {question}

Structure your response in CBA format:

1. **INTRODUCTION**: Provide historical context and significance

2. **ELABORATION**:
   - Analyze historical events, figures, or periods
   - Examine causes, consequences, and impacts
   - Evaluate primary and secondary sources
   - Consider multiple perspectives and interpretations
   - Connect to broader historical themes or patterns

3. **CONCLUSION**:
   - Summarize key historical insights
   - Discuss relevance to contemporary issues
   - Connect to Ugandan or African historical narratives

**Key Competencies Addressed**:
- Analyze historical sources and evidence
- Understand historical contexts and causality
- Evaluate historical interpretations and perspectives
- Communicate historical knowledge effectively
- Connect past events to present situations

**UNEB Reference**: History Syllabus 2023 - Source-based and essay questions.`,
    competencies: [
      'Analyze historical sources and evidence',
      'Understand historical contexts, causes, and consequences',
      'Evaluate historical interpretations and perspectives',
      'Communicate historical knowledge effectively',
      'Connect past events to present situations'
    ],
    grade_levels: ['S1', 'S2', 'S3', 'S4']
  },

  // Geography Template - Focus on spatial analysis
  Geography: {
    subject: 'Geography',
    question_types: ['factual', 'analytical', 'practical', 'application', 'evaluation', 'synthesis'],
    prompt_template: `As a Geography expert for Ugandan CBA curriculum, analyze this geographical question:

SUBJECT: Geography
GRADE LEVEL: {grade_level}
QUESTION TYPE: {question_type}
COMPETENCIES TO ADDRESS: {competencies}

QUESTION: {question}

Structure your response in CBA format:

1. **INTRODUCTION**: State the geographical concept and its importance

2. **ELABORATION**:
   - Analyze spatial patterns, processes, or features
   - Interpret maps, graphs, and geographical data
   - Explain physical or human geographical processes
   - Consider environmental, social, or economic implications
   - Connect local examples to global patterns

3. **CONCLUSION**:
   - Summarize geographical insights
   - Discuss sustainable development implications
   - Relate to Ugandan geographical context

**Key Competencies Addressed**:
- Interpret geographical data and representations
- Understand geographical processes and patterns
- Analyze spatial relationships and distributions
- Apply geographical knowledge to contemporary issues
- Communicate geographical information effectively

**UNEB Reference**: Geography Syllabus 2023 - Map work, data response, and essays.`,
    competencies: [
      'Interpret geographical data and representations',
      'Understand geographical processes and patterns',
      'Analyze spatial relationships and distributions',
      'Apply geographical knowledge to contemporary issues',
      'Communicate geographical information effectively'
    ],
    grade_levels: ['S1', 'S2', 'S3', 'S4']
  },

  // ICT Template - Focus on digital skills
  ICT: {
    subject: 'ICT',
    question_types: ['factual', 'analytical', 'practical', 'application', 'evaluation', 'synthesis'],
    prompt_template: `As an ICT expert for Ugandan CBA curriculum, provide guidance on this technology question:

SUBJECT: ICT
GRADE LEVEL: {grade_level}
QUESTION TYPE: {question_type}
COMPETENCIES TO ADDRESS: {competencies}

QUESTION: {question}

Structure your response in CBA format:

1. **INTRODUCTION**: State the ICT concept and its relevance

2. **ELABORATION**:
   - Explain digital tools, software, or processes
   - Provide step-by-step procedures or tutorials
   - Analyze the impact of technology on society
   - Consider ethical and security implications
   - Demonstrate practical applications

3. **CONCLUSION**:
   - Summarize key ICT skills or knowledge
   - Discuss future technology trends
   - Emphasize responsible technology use

**Key Competencies Addressed**:
- Use ICT tools and applications effectively
- Create and manage digital content
- Solve problems using technology
- Understand ICT ethics and security
- Communicate using digital media

**UNEB Reference**: ICT Syllabus 2023 - Practical and theoretical components.`,
    competencies: [
      'Use ICT tools and applications effectively',
      'Create and manage digital content',
      'Solve problems using appropriate technology',
      'Understand ICT ethics, security, and legal issues',
      'Communicate using digital media effectively'
    ],
    grade_levels: ['S1', 'S2', 'S3', 'S4']
  },

  // Agriculture Template - Focus on practical farming
  Agriculture: {
    subject: 'Agriculture',
    question_types: ['factual', 'analytical', 'practical', 'application', 'evaluation', 'synthesis'],
    prompt_template: `As an Agriculture expert for Ugandan CBA curriculum, provide comprehensive guidance on this agricultural question:

SUBJECT: Agriculture
GRADE LEVEL: {grade_level}
QUESTION TYPE: {question_type}
COMPETENCIES TO ADDRESS: {competencies}

QUESTION: {question}

Structure your response in CBA format:

1. **INTRODUCTION**: State the agricultural concept and its importance

2. **ELABORATION**:
   - Explain farming practices, crop/livestock management
   - Describe practical agricultural techniques
   - Analyze soil, climate, or economic factors
   - Consider sustainable and modern farming methods
   - Include relevant calculations or measurements

3. **CONCLUSION**:
   - Summarize agricultural recommendations
   - Discuss food security and sustainability
   - Relate to Ugandan agricultural context

**Key Competencies Addressed**:
- Conduct agricultural investigations and experiments
- Apply farming techniques and management practices
- Understand agricultural systems and sustainability
- Solve agricultural problems and challenges
- Communicate agricultural information effectively

**UNEB Reference**: Agriculture Syllabus 2023 - Theory and Practical Papers.`,
    competencies: [
      'Conduct agricultural investigations and experiments',
      'Apply farming techniques and management practices',
      'Understand agricultural systems and sustainability',
      'Solve agricultural problems and challenges',
      'Communicate agricultural information effectively'
    ],
    grade_levels: ['S1', 'S2', 'S3', 'S4']
  },

  // Entrepreneurship Template - Focus on business skills
  Entrepreneurship: {
    subject: 'Entrepreneurship',
    question_types: ['factual', 'analytical', 'practical', 'application', 'evaluation', 'synthesis'],
    prompt_template: `As an Entrepreneurship expert for Ugandan CBA curriculum, provide business-focused guidance:

SUBJECT: Entrepreneurship
GRADE LEVEL: {grade_level}
QUESTION TYPE: {question_type}
COMPETENCIES TO ADDRESS: {competencies}

QUESTION: {question}

Structure your response in CBA format:

1. **INTRODUCTION**: State the business concept and its entrepreneurial relevance

2. **ELABORATION**:
   - Analyze business opportunities and challenges
   - Explain business planning and management principles
   - Include financial calculations and projections
   - Consider marketing, operations, and risk management
   - Provide practical business examples

3. **CONCLUSION**:
   - Summarize business recommendations
   - Discuss economic development implications
   - Emphasize ethical business practices

**Key Competencies Addressed**:
- Develop and implement business plans
- Understand financial management and accounting
- Apply entrepreneurial skills and innovation
- Solve business problems and challenges
- Communicate business ideas effectively

**UNEB Reference**: Entrepreneurship Syllabus 2023 - Business planning and management.`,
    competencies: [
      'Develop and implement business plans',
      'Understand financial management and accounting principles',
      'Apply entrepreneurial skills and innovation',
      'Solve business problems and challenges',
      'Communicate business ideas effectively'
    ],
    grade_levels: ['S3', 'S4']
  }
};

/**
 * Get template for a specific subject
 * @param {string} subject - Subject name
 * @returns {Object|null} - Subject template or null if not found
 */
function getTemplate(subject) {
  return subjectTemplates[subject] || null;
}

/**
 * Get all available subject templates
 * @returns {Object} - All subject templates
 */
function getAllTemplates() {
  return subjectTemplates;
}

/**
 * Check if a subject has a specific template
 * @param {string} subject - Subject name
 * @returns {boolean} - Whether template exists
 */
function hasTemplate(subject) {
  return subject in subjectTemplates;
}

module.exports = {
  getTemplate,
  getAllTemplates,
  hasTemplate,
  templates: subjectTemplates
};