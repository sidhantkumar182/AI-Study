/**
 * src/routes/index.js
 * Central router — mounts all sub-routers under /api
 */

const express = require('express');
const router = express.Router();

const authRoutes       = require('./auth.routes');
const profileRoutes    = require('./profile.routes');
const pdfRoutes        = require('./pdf.routes');
const chatRoutes       = require('./chat.routes');
const summaryRoutes    = require('./summary.routes');
const quizRoutes       = require('./quiz.routes');
const flashcardRoutes  = require('./flashcard.routes');
const plannerRoutes    = require('./planner.routes');
const analyticsRoutes  = require('./analytics.routes');

// Root API Endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Study Companion API is online',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile',
      pdf: '/api/pdf',
      chat: '/api/chat',
      summary: '/api/summary',
      quiz: '/api/quiz',
      flashcards: '/api/flashcards',
      planner: '/api/planner',
      analytics: '/api/analytics',
    },
  });
});

router.use('/auth',        authRoutes);
router.use('/profile',     profileRoutes);
router.use('/pdf',         pdfRoutes);
router.use('/chat',        chatRoutes);
router.use('/summary',     summaryRoutes);
router.use('/quiz',        quizRoutes);
router.use('/flashcards',  flashcardRoutes);
router.use('/planner',     plannerRoutes);
router.use('/analytics',   analyticsRoutes);

module.exports = router;
