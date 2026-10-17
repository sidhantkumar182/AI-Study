/**
 * src/routes/quiz.routes.js
 * POST   /api/quiz/generate      — Generate quiz
 * GET    /api/quiz               — List quizzes
 * GET    /api/quiz/:id           — Get quiz
 * POST   /api/quiz/:id/submit    — Submit answers
 * GET    /api/quiz/:id/results   — Get attempt history
 * DELETE /api/quiz/:id           — Delete quiz
 */

const express = require('express');
const router = express.Router();
const {
  generateQuiz, listQuizzes, getQuiz,
  submitQuiz, getResults, deleteQuiz,
} = require('../controllers/quiz.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { generateQuizValidator, submitQuizValidator } = require('../validators/quiz.validator');

router.use(protect);

router.post('/generate',      generateQuizValidator, validate, generateQuiz);
router.get('/',               listQuizzes);
router.get('/:id',            getQuiz);
router.post('/:id/submit',    submitQuizValidator, validate, submitQuiz);
router.get('/:id/results',    getResults);
router.delete('/:id',         deleteQuiz);

module.exports = router;
