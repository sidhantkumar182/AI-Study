/**
 * src/controllers/chat.controller.js
 *
 * POST   /api/chat/conversation           — Create new conversation
 * GET    /api/chat/conversation           — List conversations
 * GET    /api/chat/conversation/:id       — Get conversation + messages
 * DELETE /api/chat/conversation/:id       — Delete conversation
 * PUT    /api/chat/conversation/:id/rename — Rename conversation
 * POST   /api/chat/conversation/:id/message — Send message (AI responds)
 */

const asyncHandler = require('express-async-handler');
const Chat = require('../models/Chat.model');
const PDF = require('../models/PDF.model');
const aiService = require('../services/ai.service');
const { sendSuccess, sendCreated, sendNotFound, sendBadRequest } = require('../utils/response');

// ── Create Conversation ───────────────────────────────────────────────────────
/**
 * @route   POST /api/chat/conversation
 * @access  Private
 */
const createConversation = asyncHandler(async (req, res) => {
  const { pdfId, title } = req.body;

  const pdf = await PDF.findOne({ _id: pdfId, user: req.user._id });
  if (!pdf) return sendNotFound(res, 'Document not found');
  if (pdf.status !== 'ready') return sendBadRequest(res, 'Document is still being processed. Please wait.');

  const chat = await Chat.create({
    user: req.user._id,
    pdf: pdfId,
    title: title || `Chat: ${pdf.title}`,
    messages: [],
  });

  return sendCreated(res, {
    message: 'Conversation created',
    data: { conversation: formatConversation(chat, pdf) },
  });
});

// ── List Conversations ────────────────────────────────────────────────────────
/**
 * @route   GET /api/chat/conversation
 * @access  Private
 */
const listConversations = asyncHandler(async (req, res) => {
  const conversations = await Chat.find({ user: req.user._id, isArchived: false })
    .populate('pdf', 'title subject')
    .sort({ updatedAt: -1 })
    .limit(50);

  return sendSuccess(res, {
    message: 'Conversations fetched',
    data: { conversations: conversations.map(c => formatConversation(c, c.pdf)) },
  });
});

// ── Get Single Conversation ────────────────────────────────────────────────────
/**
 * @route   GET /api/chat/conversation/:id
 * @access  Private
 */
const getConversation = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id })
    .populate('pdf', 'title subject');
  if (!chat) return sendNotFound(res, 'Conversation not found');

  return sendSuccess(res, {
    message: 'Conversation fetched',
    data: { conversation: formatConversation(chat, chat.pdf) },
  });
});

// ── Delete Conversation ───────────────────────────────────────────────────────
/**
 * @route   DELETE /api/chat/conversation/:id
 * @access  Private
 */
const deleteConversation = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
  if (!chat) return sendNotFound(res, 'Conversation not found');

  await Chat.deleteOne({ _id: chat._id });
  return sendSuccess(res, { message: 'Conversation deleted' });
});

// ── Rename Conversation ───────────────────────────────────────────────────────
/**
 * @route   PUT /api/chat/conversation/:id/rename
 * @access  Private
 */
const renameConversation = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const chat = await Chat.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { title },
    { new: true }
  );
  if (!chat) return sendNotFound(res, 'Conversation not found');

  return sendSuccess(res, { message: 'Conversation renamed', data: { title: chat.title } });
});

// ── Send Message + AI Response ─────────────────────────────────────────────────
/**
 * @route   POST /api/chat/conversation/:id/message
 * @access  Private
 *
 * Response shape matches the frontend ChatMessage type:
 * { id, role, content, createdAt }
 */
const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;

  const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
  if (!chat) return sendNotFound(res, 'Conversation not found');

  // Get extracted PDF text (select: false field — must explicitly request it)
  const pdf = await PDF.findById(chat.pdf).select('+extractedText');
  if (!pdf || pdf.status !== 'ready') {
    return sendBadRequest(res, 'Document not ready for chat');
  }

  // Add user message
  const userMsg = { role: 'user', content: message };
  chat.messages.push(userMsg);

  // Get AI response using the document context and prior conversation history
  const priorMessages = chat.messages.slice(0, -1);
  const aiText = await aiService.chatWithDocument(
    pdf.extractedText,
    message,
    priorMessages.slice(-10) // last 10 prior messages for context
  );

  // Add AI message
  const aiMsg = { role: 'assistant', content: aiText };
  chat.messages.push(aiMsg);

  await chat.save();

  // Return the new AI message (matches frontend ChatMessage shape)
  const savedAiMsg = chat.messages[chat.messages.length - 1];
  return sendSuccess(res, {
    message: 'Message sent',
    data: {
      message: {
        id: savedAiMsg._id.toString(),
        role: savedAiMsg.role,
        content: savedAiMsg.content,
        createdAt: savedAiMsg.createdAt,
      },
    },
  });
});

// ── Format helper ─────────────────────────────────────────────────────────────
const formatConversation = (chat, pdf) => ({
  id: chat._id.toString(),
  title: chat.title,
  pdfId: chat.pdf?._id?.toString() || chat.pdf?.toString(),
  pdfTitle: pdf?.title || null,
  pdfSubject: pdf?.subject || null,
  messageCount: chat.messageCount || chat.messages?.length || 0,
  messages: (chat.messages || []).map(m => ({
    id: m._id.toString(),
    role: m.role,
    content: m.content,
    createdAt: m.createdAt,
  })),
  createdAt: chat.createdAt,
  updatedAt: chat.updatedAt,
});

module.exports = {
  createConversation,
  listConversations,
  getConversation,
  deleteConversation,
  renameConversation,
  sendMessage,
};
