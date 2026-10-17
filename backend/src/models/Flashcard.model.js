/**
 * src/models/Flashcard.model.js
 * Flashcard deck schema — matches the frontend Flashcard type.
 */

const mongoose = require('mongoose');

// Individual card sub-schema
const cardSchema = new mongoose.Schema({
  id: { type: String, required: true },
  front: { type: String, required: true, maxlength: 5000 },
  back: { type: String, required: true, maxlength: 10000 },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  isBookmarked: { type: Boolean, default: false },

  // Spaced repetition tracking
  reviewCount: { type: Number, default: 0 },
  lastReviewedAt: { type: Date, default: null },
  masteryLevel: { type: String, enum: ['new', 'learning', 'mastered'], default: 'new' },
});

const flashcardSchema = new mongoose.Schema(
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
      default: 'Flashcard Deck',
      maxlength: 255,
    },
    cards: [cardSchema],

    // Aggregate stats
    totalCards: { type: Number, default: 0 },
    masteredCards: { type: Number, default: 0 },
    bookmarkedCount: { type: Number, default: 0 },

    // Session tracking
    lastStudiedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

flashcardSchema.index({ user: 1, pdf: 1 });
flashcardSchema.index({ user: 1, createdAt: -1 });

// Pre-save: sync aggregate counts
flashcardSchema.pre('save', function (next) {
  this.totalCards = this.cards.length;
  this.masteredCards = this.cards.filter(c => c.masteryLevel === 'mastered').length;
  this.bookmarkedCount = this.cards.filter(c => c.isBookmarked).length;
  next();
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);
module.exports = Flashcard;
