/**
 * src/routes/chat.routes.js
 * POST   /api/chat/conversation                       — Create conversation
 * GET    /api/chat/conversation                       — List conversations
 * GET    /api/chat/conversation/:id                   — Get conversation
 * DELETE /api/chat/conversation/:id                   — Delete conversation
 * PUT    /api/chat/conversation/:id/rename            — Rename conversation
 * POST   /api/chat/conversation/:id/message           — Send message + get AI reply
 */

const express = require('express');
const router = express.Router();
const {
  createConversation, listConversations, getConversation,
  deleteConversation, renameConversation, sendMessage,
} = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createConversationValidator, renameConversationValidator, sendMessageValidator,
} = require('../validators/chat.validator');

router.use(protect);

router.post('/conversation',                         createConversationValidator, validate, createConversation);
router.get('/conversation',                          listConversations);
router.get('/conversation/:id',                      getConversation);
router.delete('/conversation/:id',                   deleteConversation);
router.put('/conversation/:id/rename',               renameConversationValidator, validate, renameConversation);
router.post('/conversation/:id/message',             sendMessageValidator, validate, sendMessage);

module.exports = router;
