-- Database initialization script for Aine Learning Aid (PostgreSQL)

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    grade_level VARCHAR(50) NOT NULL,
    subjects TEXT, -- JSON array of subjects
    preferences TEXT, -- JSON object for settings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    grade_level VARCHAR(50) NOT NULL,
    content TEXT NOT NULL, -- JSON structured content
    competencies TEXT, -- JSON array of CBA competencies
    difficulty VARCHAR(20) DEFAULT 'medium',
    estimated_time INTEGER, -- minutes
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'quiz', 'practical', 'essay'
    questions TEXT NOT NULL, -- JSON array of questions
    rubric TEXT, -- JSON assessment rubric
    time_limit INTEGER, -- minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- User Progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    lesson_id INTEGER,
    assessment_id INTEGER,
    status VARCHAR(20) DEFAULT 'not_started', -- 'in_progress', 'completed'
    score REAL,
    completed_at TIMESTAMP,
    notes TEXT,
    UNIQUE(user_id, lesson_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id),
    FOREIGN KEY (assessment_id) REFERENCES assessments(id)
);

-- AI Interactions table
CREATE TABLE IF NOT EXISTS ai_interactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    type VARCHAR(50) NOT NULL, -- 'content_generation', 'question_answer', 'image_generation'
    prompt TEXT NOT NULL,
    response TEXT,
    tokens_used INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Questions table for AI answering engine
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    subject VARCHAR(100) NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    grade_level VARCHAR(50) NOT NULL,
    competencies TEXT, -- JSON array of CBA competencies
    context TEXT, -- Optional additional context
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Answers table for AI responses
CREATE TABLE IF NOT EXISTS answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER,
    user_id INTEGER,
    content TEXT NOT NULL, -- JSON structured CBA response
    tokens_used INTEGER,
    processing_time INTEGER, -- milliseconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- User Sessions table for anonymous tracking
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER, -- NULL for anonymous users
    ip_address VARCHAR(45),
    user_agent TEXT,
    country VARCHAR(100),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Analytics Events table for usage data
CREATE TABLE IF NOT EXISTS analytics_events (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255),
    user_id INTEGER,
    event_type VARCHAR(100) NOT NULL, -- e.g., 'question_asked', 'answer_generated', 'subject_selected'
    event_data TEXT, -- JSON data
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_lessons_subject ON lessons(subject);
CREATE INDEX IF NOT EXISTS idx_lessons_grade ON lessons(grade_level);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson ON user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_questions_user ON questions(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject);
CREATE INDEX IF NOT EXISTS idx_answers_question ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);