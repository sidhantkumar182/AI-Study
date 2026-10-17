/**
 * src/routes/flashcard.routes.js
 */

const express = require('express');
const router = express.Router();
const {
  generateFlashcards, listDecks, getDeck,
  deleteDeck, toggleBookmark, reviewCard,
} = require('../controllers/flashcard.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/generate',                           generateFlashcards);
router.get('/',                                    listDecks);
router.get('/:id',                                 getDeck);
router.delete('/:id',                              deleteDeck);
router.put('/:id/card/:cardId/bookmark',           toggleBookmark);
router.put('/:id/card/:cardId/review',             reviewCard);

module.exports = router;
