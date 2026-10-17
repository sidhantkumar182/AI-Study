/**
 * src/models/Chat.model.js
 * Chat conversation and messages schema.
 * Matches the frontend ChatMessage / Conversation types.
 */

const mongoose = require('mongoose');

// Individual message sub-schema
const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: [50000, 'Message too long'],
    },
    // Optional: token count for cost tracking
    tokenCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Conversation schema — one conversation = one PDF + its messages
const chatSchema = new mongoose.Schema(
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
      default: 'New Conversation',
      maxlength: [255, 'Title too long'],
    },
    messages: [messageSchema],

    // Quick stats
    messageCount: {
      type: Number,
      default: 0,
    },
    lastMessageAt: {
      type: Date,
      default: null,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
chatSchema.index({ user: 1, createdAt: -1 });
chatSchema.index({ user: 1, pdf: 1 });

// ── Pre-save: update messageCount and lastMessageAt ──────────────────────────
chatSchema.pre('save', function (next) {
  this.messageCount = this.messages.length;
  if (this.messages.length > 0) {
    this.lastMessageAt = this.messages[this.messages.length - 1].createdAt || new Date();
  }
  next();
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
