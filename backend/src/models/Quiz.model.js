/**
 * src/models/Quiz.model.js
 * Quiz schema — matches the frontend QuizQuestion type.
 */

const mongoose = require('mongoose');

// Individual question sub-schema
const questionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true, validate: v => Array.isArray(v) && v.length >= 2 },
  correctAnswer: { type: Number, required: true, min: 0, max: 3 },
  explanation: { type: String, default: '' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
});

// Result per attempt
const attemptSchema = new mongoose.Schema(
  {
    score: { type: Number, required: true },          // percentage
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    timeTakenSeconds: { type: Number, default: 0 },
    answers: [
      {
        questionId: String,
        selectedAnswer: Number,
        isCorrect: Boolean,
      },
    ],
  },
  { timestamps: true }
);

const quizSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    pdf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PDF',
      required: true,
    },
    title: {
      type: String,
      default: 'Generated Quiz',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    questions: [questionSchema],
    questionCount: {
      type: Number,
      default: 10,
    },
    attempts: [attemptSchema],

    // Best score across all attempts
    bestScore: {
      type: Number,
      default: 0,
    },
    attemptCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

quizSchema.index({ user: 1, pdf: 1 });
quizSchema.index({ user: 1, createdAt: -1 });

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
