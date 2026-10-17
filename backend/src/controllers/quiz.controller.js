/**
 * src/controllers/quiz.controller.js
 *
 * POST   /api/quiz/generate       — Generate quiz from PDF
 * GET    /api/quiz                 — List user's quizzes
 * GET    /api/quiz/:id             — Get quiz with questions
 * POST   /api/quiz/:id/submit      — Submit answers, get score
 * GET    /api/quiz/:id/results     — Get attempt history
 * DELETE /api/quiz/:id             — Delete quiz
 */

const asyncHandler = require('express-async-handler');
const Quiz = require('../models/Quiz.model');
const PDF = require('../models/PDF.model');
const User = require('../models/User.model');
const aiService = require('../services/ai.service');
const { generateShortId } = require('../utils/helpers');
const { sendSuccess, sendCreated, sendNotFound, sendBadRequest } = require('../utils/response');

// ── Generate Quiz ─────────────────────────────────────────────────────────────
/**
 * @route   POST /api/quiz/generate
 * @access  Private
 * Response shape matches frontend QuizQuestion[] type
 */
const generateQuiz = asyncHandler(async (req, res) => {
  const { pdfId, difficulty = 'medium', questionCount = 10 } = req.body;

  const pdf = await PDF.findOne({ _id: pdfId, user: req.user._id }).select('+extractedText');
  if (!pdf) return sendNotFound(res, 'Document not found');
  if (pdf.status !== 'ready') return sendBadRequest(res, 'Document is still being processed');

  // Generate questions via Gemini
  const rawQuestions = await aiService.generateQuiz(pdf.extractedText, difficulty, questionCount);

  // Ensure each question has a valid ID
  const questions = rawQuestions.map((q, i) => ({
    ...q,
    id: q.id || generateShortId('q'),
  }));

  const quiz = await Quiz.create({
    user: req.user._id,
    pdf: pdfId,
    title: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Quiz — ${pdf.title}`,
    difficulty,
    questions,
    questionCount: questions.length,
  });

  // Update user stats
  await User.findByIdAndUpdate(req.user._id, { $inc: { 'stats.quizzesTaken': 1 } });

  return sendCreated(res, {
    message: 'Quiz generated',
    data: { quiz: formatQuiz(quiz) },
  });
});

// ── List Quizzes ──────────────────────────────────────────────────────────────
/** @route GET /api/quiz */
const listQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ user: req.user._id })
    .populate('pdf', 'title subject')
    .sort({ createdAt: -1 })
    .select('-questions -attempts');

  return sendSuccess(res, {
    message: 'Quizzes fetched',
    data: { quizzes: quizzes.map(q => formatQuizMeta(q)) },
  });
});

// ── Get Quiz ──────────────────────────────────────────────────────────────────
/** @route GET /api/quiz/:id */
const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id });
  if (!quiz) return sendNotFound(res, 'Quiz not found');

  return sendSuccess(res, {
    message: 'Quiz fetched',
    data: { quiz: formatQuiz(quiz) },
  });
});

// ── Submit Quiz ───────────────────────────────────────────────────────────────
/**
 * @route   POST /api/quiz/:id/submit
 * @access  Private
 * Accepts: { answers: [{questionId, selectedAnswer}], timeTakenSeconds }
 * Returns: { score, correctAnswers, totalQuestions, answers (with isCorrect), explanation }
 */
const submitQuiz = asyncHandler(async (req, res) => {
  const { answers, timeTakenSeconds = 0 } = req.body;

  const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id });
  if (!quiz) return sendNotFound(res, 'Quiz not found');

  // Grade each answer
  let correctCount = 0;
  const gradedAnswers = answers.map(a => {
    const question = quiz.questions.find(q => q.id === a.questionId);
    if (!question) return { ...a, isCorrect: false };
    const isCorrect = question.correctAnswer === a.selectedAnswer;
    if (isCorrect) correctCount++;
    return { questionId: a.questionId, selectedAnswer: a.selectedAnswer, isCorrect };
  });

  const score = Math.round((correctCount / quiz.questions.length) * 100);

  // Save attempt
  quiz.attempts.push({ score, totalQuestions: quiz.questions.length, correctAnswers: correctCount, timeTakenSeconds, answers: gradedAnswers });
  quiz.attemptCount += 1;
  quiz.bestScore = Math.max(quiz.bestScore, score);
  await quiz.save();

  // Return detailed result with explanations
  const detailed = answers.map(a => {
    const q = quiz.questions.find(q => q.id === a.questionId);
    const isCorrect = q?.correctAnswer === a.selectedAnswer;
    return {
      questionId: a.questionId,
      selectedAnswer: a.selectedAnswer,
      correctAnswer: q?.correctAnswer,
      isCorrect,
      explanation: q?.explanation || '',
    };
  });

  return sendSuccess(res, {
    message: 'Quiz submitted',
    data: {
      result: {
        score,
        correctAnswers: correctCount,
        totalQuestions: quiz.questions.length,
        timeTakenSeconds,
        answers: detailed,
      },
    },
  });
});

// ── Get Results History ───────────────────────────────────────────────────────
/** @route GET /api/quiz/:id/results */
const getResults = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id }).select('title difficulty attempts bestScore attemptCount');
  if (!quiz) return sendNotFound(res, 'Quiz not found');

  return sendSuccess(res, {
    message: 'Results fetched',
    data: {
      title: quiz.title,
      difficulty: quiz.difficulty,
      bestScore: quiz.bestScore,
      attemptCount: quiz.attemptCount,
      attempts: quiz.attempts,
    },
  });
});

// ── Delete Quiz ───────────────────────────────────────────────────────────────
/** @route DELETE /api/quiz/:id */
const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id });
  if (!quiz) return sendNotFound(res, 'Quiz not found');
  await Quiz.deleteOne({ _id: quiz._id });
  return sendSuccess(res, { message: 'Quiz deleted' });
});

// ── Format helpers ────────────────────────────────────────────────────────────
const formatQuiz = (quiz) => ({
  id: quiz._id.toString(),
  title: quiz.title,
  difficulty: quiz.difficulty,
  questionCount: quiz.questionCount,
  bestScore: quiz.bestScore,
  attemptCount: quiz.attemptCount,
  questions: quiz.questions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    difficulty: q.difficulty,
  })),
  createdAt: quiz.createdAt,
});

const formatQuizMeta = (quiz) => ({
  id: quiz._id.toString(),
  title: quiz.title,
  difficulty: quiz.difficulty,
  questionCount: quiz.questionCount,
  bestScore: quiz.bestScore,
  attemptCount: quiz.attemptCount,
  pdfTitle: quiz.pdf?.title,
  pdfSubject: quiz.pdf?.subject,
  createdAt: quiz.createdAt,
});

module.exports = { generateQuiz, listQuizzes, getQuiz, submitQuiz, getResults, deleteQuiz };
