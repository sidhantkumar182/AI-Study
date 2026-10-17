import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Shuffle, Bookmark, BookmarkCheck,
  RotateCcw, Eye, Plus, Sparkles, Loader2
} from 'lucide-react';
import { Button, Badge, ProgressBar } from '../components/ui';
import { shuffle } from '../utils';
import { flashcardAPI, pdfAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function FlashcardsPage() {
  const [decks, setDecks] = useState([]);
  const [activeDeck, setActiveDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewed, setViewed] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // PDF modal for generating new flashcard deck
  const [pdfs, setPdfs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [generating, setGenerating] = useState(false);

  const loadDecks = useCallback(async () => {
    try {
      const [decksRes, pdfsRes] = await Promise.all([
        flashcardAPI.listDecks(),
        pdfAPI.list(),
      ]);

      const dList = decksRes.data?.data?.decks || [];
      const pList = pdfsRes.data?.data?.documents || [];

      setDecks(dList);
      setPdfs(pList);

      if (dList.length > 0) {
        const fullDeckRes = await flashcardAPI.getDeck(dList[0].id);
        const fullDeck = fullDeckRes.data?.data?.deck;
        if (fullDeck) {
          setActiveDeck(fullDeck);
          setCards(fullDeck.cards || []);
        }
      }
    } catch (err) {
      console.error('Failed to load flashcard decks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDecks();
  }, [loadDecks]);

  const selectDeck = async (metaDeck) => {
    setLoading(true);
    try {
      const res = await flashcardAPI.getDeck(metaDeck.id);
      const fullDeck = res.data?.data?.deck;
      if (fullDeck) {
        setActiveDeck(fullDeck);
        setCards(fullDeck.cards || []);
        setCurrentIndex(0);
        setIsFlipped(false);
        setViewed(new Set());
      }
    } catch (err) {
      toast.error('Failed to load deck details');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDeck = async (pdfId) => {
    setGenerating(true);
    try {
      const res = await flashcardAPI.generate({ pdfId, count: 15 });
      const newDeck = res.data?.data?.deck;
      if (newDeck) {
        setDecks(prev => [newDeck, ...prev]);
        setActiveDeck(newDeck);
        setCards(newDeck.cards || []);
        setCurrentIndex(0);
        setIsFlipped(false);
        setViewed(new Set());
        toast.success('Flashcards generated!');
        setShowModal(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate flashcards.');
    } finally {
      setGenerating(false);
    }
  };

  const currentCard = cards[currentIndex];
  const progress = cards.length > 0 ? (viewed.size / cards.length) * 100 : 0;

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    if (currentCard) {
      setViewed(prev => new Set([...prev, currentCard.id]));
    }
  };

  const next = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const shuffleCards = () => {
    setCards(shuffle(cards));
    setCurrentIndex(0);
    setIsFlipped(false);
    setViewed(new Set());
    toast.success('Cards shuffled!');
  };

  const toggleBookmark = async () => {
    if (!currentCard || !activeDeck) return;
    try {
      const res = await flashcardAPI.toggleBookmark(activeDeck.id, currentCard.id);
      const isBookmarked = res.data?.data?.isBookmarked;
      setCards(prev => prev.map(c =>
        c.id === currentCard.id ? { ...c, isBookmarked } : c
      ));
      toast.success(isBookmarked ? 'Card bookmarked!' : 'Bookmark removed');
    } catch (err) {
      toast.error('Failed to toggle bookmark');
    }
  };

  const handleReview = async (masteryLevel) => {
    if (!currentCard || !activeDeck) return;
    try {
      await flashcardAPI.reviewCard(activeDeck.id, currentCard.id, masteryLevel);
      setCards(prev => prev.map(c =>
        c.id === currentCard.id ? { ...c, masteryLevel } : c
      ));
      next();
    } catch {
      next();
    }
  };

  return (
    <div className="page-enter space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-surface-100 mb-1">
            Flashcards
          </h1>
          <p className="text-surface-500 dark:text-surface-400">
            Review your AI-generated flashcard decks
          </p>
        </div>
        <Button leftIcon={<Plus size={18} />} onClick={() => setShowModal(true)}>
          Generate Deck
        </Button>
      </div>

      {/* Deck selector */}
      {decks.length === 0 ? (
        <div className="card p-6 text-center text-surface-400 text-sm">
          No flashcard decks generated yet. Click "Generate Deck" to create one from your PDFs!
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {decks.map(deck => (
            <button
              key={deck.id}
              onClick={() => selectDeck(deck)}
              className={`shrink-0 px-5 py-3 rounded-2xl border text-left transition-all ${
                activeDeck?.id === deck.id
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 shadow-brand'
                  : 'border-surface-200 dark:border-surface-700 hover:border-surface-300'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-3 h-3 rounded-full shrink-0 bg-brand-500" />
                <p className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate max-w-[200px]">
                  {deck.title}
                </p>
              </div>
              <p className="text-xs text-surface-400">
                {deck.totalCards || deck.cards?.length || 0} cards • {deck.pdfSubject || 'Study'}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Main Flashcard View */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-brand-500" size={32} />
        </div>
      ) : activeDeck && currentCard ? (
        <>
          {/* Progress */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-semibold text-surface-900 dark:text-surface-100">
                  {activeDeck.title}
                </h2>
                <p className="text-xs text-surface-400 mt-0.5">
                  {cards.length} cards in this deck
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                  {currentIndex + 1}
                  <span className="text-sm font-normal text-surface-400">/{cards.length}</span>
                </p>
                <p className="text-xs text-surface-400">{viewed.size} reviewed</p>
              </div>
            </div>
            <ProgressBar value={progress} size="sm" variant="gradient" />
          </div>

          {/* Flashcard */}
          <div className="flex flex-col items-center gap-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-2xl h-80"
              >
                <div
                  className="w-full h-full cursor-pointer select-none rounded-3xl card p-8 flex flex-col items-center justify-center text-center relative border-2 border-surface-200 dark:border-surface-700 hover:border-brand-400 transition-all shadow-card"
                  onClick={flipCard}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleBookmark(); }}
                    className="absolute top-4 right-4 p-2 text-surface-400 hover:text-amber-500 transition-colors"
                  >
                    {currentCard.isBookmarked ? (
                      <BookmarkCheck size={22} className="text-amber-500" />
                    ) : (
                      <Bookmark size={22} />
                    )}
                  </button>

                  <Badge variant={isFlipped ? 'success' : 'brand'} className="absolute top-4 left-4">
                    {isFlipped ? 'ANSWER' : 'QUESTION'}
                  </Badge>

                  <div className="my-auto max-w-xl px-4">
                    <p className="text-lg md:text-xl font-medium text-surface-900 dark:text-surface-100 leading-relaxed">
                      {isFlipped ? currentCard.back : currentCard.front}
                    </p>
                  </div>

                  <p className="text-xs text-surface-400 flex items-center gap-1">
                    <RotateCcw size={12} /> Click card to flip
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Review mastery buttons & navigation */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl justify-between">
              <div className="flex gap-2">
                <Button variant="secondary" size="md" onClick={shuffleCards} leftIcon={<Shuffle size={16} />}>
                  Shuffle
                </Button>
              </div>

              {isFlipped && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-danger-500 hover:bg-danger-600 text-white"
                    onClick={() => handleReview('new')}
                  >
                    Hard
                  </Button>
                  <Button
                    size="sm"
                    className="bg-warning-500 hover:bg-warning-600 text-white"
                    onClick={() => handleReview('learning')}
                  >
                    Good
                  </Button>
                  <Button
                    size="sm"
                    className="bg-success-500 hover:bg-success-600 text-white"
                    onClick={() => handleReview('mastered')}
                  >
                    Easy
                  </Button>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={prev}
                  disabled={currentIndex === 0}
                  leftIcon={<ChevronLeft size={18} />}
                >
                  Prev
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={next}
                  disabled={currentIndex === cards.length - 1}
                  rightIcon={<ChevronRight size={18} />}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* Modal to generate flashcards */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-50 dark:bg-surface-900 rounded-3xl max-w-md w-full p-6 space-y-4 border border-surface-200 dark:border-surface-700">
            <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <Sparkles size={20} className="text-brand-500" />
              Generate Flashcard Deck
            </h3>
            {pdfs.length === 0 ? (
              <p className="text-sm text-surface-400">Please upload a PDF first to generate flashcards.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {pdfs.map(p => (
                  <button
                    key={p.id}
                    disabled={generating}
                    onClick={() => handleGenerateDeck(p.id)}
                    className="w-full text-left p-3 rounded-xl border border-surface-200 dark:border-surface-700 hover:border-brand-500 flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">
                      {p.title || p.originalName}
                    </span>
                    {generating ? <Loader2 size={16} className="animate-spin text-brand-500" /> : <Plus size={16} />}
                  </button>
                ))}
              </div>
            )}
            <div className="flex justify-end pt-2">
              <Button variant="ghost" onClick={() => setShowModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
