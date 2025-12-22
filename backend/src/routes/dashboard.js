const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total questions asked
    const questionsResult = await db.get('SELECT COUNT(*) as count FROM questions');
    const questionsCount = questionsResult.count;

    // Get unique subjects covered
    const subjectsResult = await db.all('SELECT DISTINCT subject FROM questions');
    const subjectsCount = subjectsResult.length;

    // Get average score (mock for now)
    const avgScore = 85;

    // Get study streak (mock for now)
    const studyStreak = 7;

    res.json({
      questionsAsked: questionsCount,
      subjectsCovered: subjectsCount,
      averageScore: avgScore,
      studyStreak: studyStreak
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get recent questions
router.get('/questions', async (req, res) => {
  try {
    const questions = await db.all(`
      SELECT q.id, q.subject, q.content as question, q.created_at,
             a.content as answer, a.created_at as answered_at
      FROM questions q
      LEFT JOIN answers a ON q.id = a.question_id
      ORDER BY q.created_at DESC
      LIMIT 10
    `);

    const formattedQuestions = questions.map(q => ({
      id: q.id,
      subject: q.subject,
      question: q.content.length > 100 ? q.content.substring(0, 100) + '...' : q.content,
      timestamp: new Date(q.created_at).toLocaleString(),
      status: q.answer ? 'answered' : 'pending'
    }));

    res.json(formattedQuestions);
  } catch (error) {
    console.error('Dashboard questions error:', error);
    res.status(500).json({ error: 'Failed to fetch recent questions' });
  }
});

// Get competency progress (mock data for now)
router.get('/competencies', async (req, res) => {
  try {
    // Mock competency data - in real app, this would be calculated from user progress
    const competencies = [
      { name: 'Critical Thinking', progress: 75 },
      { name: 'Problem Solving', progress: 60 },
      { name: 'Communication', progress: 85 },
      { name: 'Research Skills', progress: 45 }
    ];

    res.json(competencies);
  } catch (error) {
    console.error('Dashboard competencies error:', error);
    res.status(500).json({ error: 'Failed to fetch competency progress' });
  }
});

module.exports = router;