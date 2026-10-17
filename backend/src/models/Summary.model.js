/**
 * src/models/Summary.model.js
 * AI-generated summaries for a PDF document.
 */

const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema(
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

    // Short 2-3 sentence overview
    shortSummary: {
      type: String,
      default: '',
    },

    // Bullet point key takeaways (array of strings)
    bulletPoints: {
      type: [String],
      default: [],
    },

    // Detailed multi-paragraph summary
    detailedSummary: {
      type: String,
      default: '',
    },

    // Key concepts (array of { title, explanation, importance })
    keyConcepts: [
      {
        title: String,
        explanation: String,
        importance: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
      },
    ],

    // Key terms / glossary
    keyTerms: [
      {
        term: String,
        definition: String,
      },
    ],

    // Which fields have been generated
    generated: {
      short: { type: Boolean, default: false },
      bullets: { type: Boolean, default: false },
      detailed: { type: Boolean, default: false },
      concepts: { type: Boolean, default: false },
      terms: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

summarySchema.index({ user: 1, pdf: 1 });

const Summary = mongoose.model('Summary', summarySchema);
module.exports = Summary;
