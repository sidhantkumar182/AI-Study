/**
 * src/controllers/flashcard.controller.js
 *
 * POST   /api/flashcards/generate        — Generate flashcards from PDF
 * GET    /api/flashcards                  — List user's decks
 * GET    /api/flashcards/:id             — Get deck with all cards
 * DELETE /api/flashcards/:id             — Delete deck
 * PUT    /api/flashcards/:id/card/:cardId/bookmark  — Toggle bookmark
 * PUT    /api/flashcards/:id/card/:cardId/review    — Mark card reviewed
 */

const asyncHandler = require('express-async-handler');
const Flashcard = require('../models/Flashcard.model');
const PDF = require('../models/PDF.model');
const User = require('../models/User.model');
const aiService = require('../services/ai.service');
const { generateShortId } = require('../utils/helpers');
const { sendSuccess, sendCreated, sendNotFound, sendBadRequest } = require('../utils/response');

// ── Generate Flashcards ───────────────────────────────────────────────────────
/**
 * @route   POST /api/flashcards/generate
 * @access  Private
 * Response shape matches frontend Flashcard type.
 */
const generateFlashcards = asyncHandler(async (req, res) => {
  const { pdfId, count = 20 } = req.body;

  const pdf = await PDF.findOne({ _id: pdfId, user: req.user._id }).select('+extractedText');
  if (!pdf) return sendNotFound(res, 'Document not found');
  if (pdf.status !== 'ready') return sendBadRequest(res, 'Document is still being processed');

  const rawCards = await aiService.generateFlashcards(pdf.extractedText, count);

  const cards = rawCards.map((c, i) => ({
    ...c,
    id: c.id || generateShortId('fc'),
    isBookmarked: false,
    reviewCount: 0,
    masteryLevel: 'new',
  }));

  const deck = await Flashcard.create({
    user: req.user._id,
    pdf: pdfId,
    title: `Flashcards — ${pdf.title}`,
    cards,
  });

  // Update user stats
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { 'stats.flashcardsReviewed': cards.length },
  });

  return sendCreated(res, {
    message: 'Flashcards generated',
    data: { deck: formatDeck(deck) },
  });
});

// ── List Decks ─────────────────────────────────────────────────────────────────
/** @route GET /api/flashcards */
const listDecks = asyncHandler(async (req, res) => {
  const decks = await Flashcard.find({ user: req.user._id })
    .populate('pdf', 'title subject')
    .sort({ createdAt: -1 })
    .select('-cards');

  return sendSuccess(res, {
    message: 'Flashcard decks fetched',
    data: { decks: decks.map(d => formatDeckMeta(d)) },
  });
});

// ── Get Deck ──────────────────────────────────────────────────────────────────
/** @route GET /api/flashcards/:id */
const getDeck = asyncHandler(async (req, res) => {
  const deck = await Flashcard.findOne({ _id: req.params.id, user: req.user._id });
  if (!deck) return sendNotFound(res, 'Flashcard deck not found');

  return sendSuccess(res, {
    message: 'Deck fetched',
    data: { deck: formatDeck(deck) },
  });
});

// ── Delete Deck ────────────────────────────────────────────────────────────────
/** @route DELETE /api/flashcards/:id */
const deleteDeck = asyncHandler(async (req, res) => {
  const deck = await Flashcard.findOne({ _id: req.params.id, user: req.user._id });
  if (!deck) return sendNotFound(res, 'Deck not found');
  await Flashcard.deleteOne({ _id: deck._id });
  return sendSuccess(res, { message: 'Deck deleted' });
});

// ── Toggle Bookmark ────────────────────────────────────────────────────────────
/** @route PUT /api/flashcards/:id/card/:cardId/bookmark */
const toggleBookmark = asyncHandler(async (req, res) => {
  const deck = await Flashcard.findOne({ _id: req.params.id, user: req.user._id });
  if (!deck) return sendNotFound(res, 'Deck not found');

  const card = deck.cards.find(c => c.id === req.params.cardId);
  if (!card) return sendNotFound(res, 'Card not found');

  card.isBookmarked = !card.isBookmarked;
  await deck.save();

  return sendSuccess(res, {
    message: `Card ${card.isBookmarked ? 'bookmarked' : 'unbookmarked'}`,
    data: { isBookmarked: card.isBookmarked },
  });
});

// ── Mark Card Reviewed ─────────────────────────────────────────────────────────
/**
 * @route   PUT /api/flashcards/:id/card/:cardId/review
 * @body    { masteryLevel: 'new' | 'learning' | 'mastered' }
 */
const reviewCard = asyncHandler(async (req, res) => {
  const { masteryLevel } = req.body;
  const validLevels = ['new', 'learning', 'mastered'];
  if (!validLevels.includes(masteryLevel)) return sendBadRequest(res, 'Invalid mastery level');

  const deck = await Flashcard.findOne({ _id: req.params.id, user: req.user._id });
  if (!deck) return sendNotFound(res, 'Deck not found');

  const card = deck.cards.find(c => c.id === req.params.cardId);
  if (!card) return sendNotFound(res, 'Card not found');

  card.masteryLevel = masteryLevel;
  card.reviewCount += 1;
  card.lastReviewedAt = new Date();
  deck.lastStudiedAt = new Date();

  await deck.save();

  return sendSuccess(res, {
    message: 'Card reviewed',
    data: { masteryLevel: card.masteryLevel, reviewCount: card.reviewCount },
  });
});

// ── Format helpers ─────────────────────────────────────────────────────────────
const formatDeck = (deck) => ({
  id: deck._id.toString(),
  title: deck.title,
  totalCards: deck.totalCards,
  masteredCards: deck.masteredCards,
  bookmarkedCount: deck.bookmarkedCount,
  lastStudiedAt: deck.lastStudiedAt,
  cards: deck.cards.map(c => ({
    id: c.id,
    front: c.front,
    back: c.back,
    difficulty: c.difficulty,
    isBookmarked: c.isBookmarked,
    reviewCount: c.reviewCount,
    masteryLevel: c.masteryLevel,
    lastReviewedAt: c.lastReviewedAt,
  })),
  createdAt: deck.createdAt,
});

const formatDeckMeta = (deck) => ({
  id: deck._id.toString(),
  title: deck.title,
  totalCards: deck.totalCards,
  masteredCards: deck.masteredCards,
  bookmarkedCount: deck.bookmarkedCount,
  pdfTitle: deck.pdf?.title,
  pdfSubject: deck.pdf?.subject,
  lastStudiedAt: deck.lastStudiedAt,
  createdAt: deck.createdAt,
});

module.exports = {
  generateFlashcards,
  listDecks,
  getDeck,
  deleteDeck,
  toggleBookmark,
  reviewCard,
};
