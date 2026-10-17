import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle, Sparkles, ChevronRight, ChevronLeft,
  CheckCircle, XCircle, RotateCcw, Target, Loader2
} from 'lucide-react';
import { Button, Badge, ProgressBar, CircularProgress } from '../components/ui';
import { pdfAPI, quizAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function QuizPage() {
  const [quizState, setQuizState] = useState('config');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedPdfId, setSelectedPdfId] = useState('');
  const [pdfs, setPdfs] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [pdfRes, quizRes] = await Promise.all([
          pdfAPI.list(),
          quizAPI.listQuizzes(),
        ]);
        const dList = pdfRes.data?.data?.documents || [];
        const qList = quizRes.data?.data?.quizzes || [];

        setPdfs(dList);
        setQuizzes(qList);
        if (dList.length > 0) {
          setSelectedPdfId(dList[0].id);
        }
      } catch (err) {
        console.error('Failed to load quiz data:', err);
      }
    }
    loadData();
  }, []);

  const handleGenerateQuiz = async () => {
    if (!selectedPdfId) {
      toast.error('Please select a PDF document first.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await quizAPI.generate({
        pdfId: selectedPdfId,
        difficulty,
        questionCount,
      });

      const qData = res.data?.data?.quiz;
      if (qData) {
        setActiveQuiz(qData);
        setQuestions(qData.questions || []);
        setCurrentIndex(0);
        setAnswers({});
        setShowExplanation(false);
        setQuizState('quiz');
        toast.success(`Generated ${qData.questions?.length} questions!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate quiz.');
    } finally {
      setIsGenerating(false);
    }
  };

  const startExistingQuiz = async (id) => {
    setIsGenerating(true);
    try {
      const res = await quizAPI.getQuiz(id);
      const qData = res.data?.data?.quiz;
      if (qData) {
        setActiveQuiz(qData);
        setQuestions(qData.questions || []);
        setCurrentIndex(0);
        setAnswers({});
        setShowExplanation(false);
        setQuizState('quiz');
      }
    } catch (err) {
      toast.error('Failed to load quiz.');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectAnswer = (optionIndex) => {
    if (answers[currentQ.id] !== undefined) return;
    setAnswers(prev => ({ ...prev, [currentQ.id]: optionIndex }));
    setShowExplanation(true);
  };

  const submitQuiz = async () => {
    if (!activeQuiz) return;
    const formattedAnswers = Object.entries(answers).map(([qId, selected]) => ({
      questionId: qId,
      selectedAnswer: selected,
    }));

    try {
      const res = await quizAPI.submit(activeQuiz.id, {
        answers: formattedAnswers,
        timeTakenSeconds: 120,
      });
      setResult(res.data?.data?.result);
      setQuizState('results');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit quiz.');
      setQuizState('results');
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowExplanation(answers[questions[currentIndex + 1]?.id] !== undefined);
    } else {
      submitQuiz();
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowExplanation(answers[questions[currentIndex - 1]?.id] !== undefined);
    }
  };

  const resetQuiz = () => {
    setQuizState('config');
    setAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    setResult(null);
  };

  const currentQ = questions[currentIndex];
  const userAnswer = currentQ ? answers[currentQ.id] : undefined;
  const progress = questions.length > 0 ? ((currentIndex + (userAnswer !== undefined ? 1 : 0)) / questions.length) * 100 : 0;

  const difficultyConfig = {
    easy: { color: 'text-success-500', label: 'Easy', bg: 'bg-success-500/10 border-success-500/30' },
    medium: { color: 'text-warning-500', label: 'Medium', bg: 'bg-warning-500/10 border-warning-500/30' },
    hard: { color: 'text-danger-500', label: 'Hard', bg: 'bg-danger-500/10 border-danger-500/30' },
  };

  // ── CONFIG STATE ──
  if (quizState === 'config') {
    return (
      <div className="page-enter max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-surface-100 mb-1">
            Quiz Generator
          </h1>
          <p className="text-surface-500 dark:text-surface-400">
            Configure your quiz and let AI generate questions
          </p>
        </div>

        <div className="card p-6 space-y-6">
          {/* Difficulty */}
          <div>
            <label className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-3 block">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['easy', 'medium', 'hard'].map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`p-4 rounded-2xl border-2 text-center transition-all ${
                    difficulty === d
                      ? difficultyConfig[d].bg + ' border-current'
                      : 'border-surface-200 dark:border-surface-700 hover:border-surface-300'
                  }`}
                >
                  <div className="text-2xl mb-1">
                    {d === 'easy' ? '🟢' : d === 'medium' ? '🟡' : '🔴'}
                  </div>
                  <p className={`text-sm font-semibold capitalize ${
                    difficulty === d ? difficultyConfig[d].color : 'text-surface-700 dark:text-surface-300'
                  }`}>
                    {difficultyConfig[d].label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Question count */}
          <div>
            <label className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-3 flex justify-between">
              Number of Questions
              <span className="text-brand-600 dark:text-brand-400">{questionCount}</span>
            </label>
            <input
              type="range"
              min={5}
              max={20}
              step={5}
              value={questionCount}
              onChange={e => setQuestionCount(Number(e.target.value))}
              className="w-full accent-brand-500"
            />
            <div className="flex justify-between text-xs text-surface-400 mt-1">
              <span>5</span><span>10</span><span>15</span><span>20</span>
            </div>
          </div>

          {/* Source */}
          <div>
            <label className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-3 block">
              Source Document
            </label>
            {pdfs.length === 0 ? (
              <p className="text-xs text-surface-400">No uploaded PDFs available. Please upload a PDF first.</p>
            ) : (
              <select
                value={selectedPdfId}
                onChange={e => setSelectedPdfId(e.target.value)}
                className="input-base text-sm w-full bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl p-3"
              >
                {pdfs.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title || p.originalName}
                  </option>
                ))}
              </select>
            )}
          </div>

          <Button
            size="lg"
            fullWidth
            isLoading={isGenerating}
            onClick={handleGenerateQuiz}
            leftIcon={<Sparkles size={18} />}
          >
            {isGenerating ? 'Generating Quiz...' : 'Generate Quiz with AI'}
          </Button>
        </div>

        {/* Recent quizzes */}
        {quizzes.length > 0 && (
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-surface-900 dark:text-surface-100">
              Previous Quizzes ({quizzes.length})
            </h2>
            <div className="space-y-2">
              {quizzes.map(q => (
                <div
                  key={q.id}
                  onClick={() => startExistingQuiz(q.id)}
                  className="p-3.5 rounded-xl border border-surface-100 dark:border-surface-700 hover:border-brand-300 flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{q.title}</p>
                    <p className="text-xs text-surface-400">{q.questionCount} questions • {q.difficulty}</p>
                  </div>
                  <Badge variant={q.bestScore >= 80 ? 'success' : 'warning'}>
                    Best: {q.bestScore}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── QUIZ RUNNER STATE ──
  if (quizState === 'quiz' && currentQ) {
    return (
      <div className="page-enter max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={resetQuiz}>
            Exit Quiz
          </Button>
          <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        <ProgressBar value={progress} size="sm" variant="gradient" />

        <div className="card p-6 space-y-6">
          <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 leading-relaxed">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options?.map((option, idx) => {
              const isSelected = userAnswer === idx;
              const isCorrectOption = idx === currentQ.correctAnswer;
              let optionStyle = 'border-surface-200 dark:border-surface-700 hover:border-brand-400';

              if (userAnswer !== undefined) {
                if (isCorrectOption) {
                  optionStyle = 'border-success-500 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300';
                } else if (isSelected) {
                  optionStyle = 'border-danger-500 bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-300';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => selectAnswer(idx)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${optionStyle}`}
                >
                  <span className="text-sm font-medium">{option}</span>
                  {userAnswer !== undefined && (
                    isCorrectOption ? (
                      <CheckCircle size={18} className="text-success-500 shrink-0" />
                    ) : isSelected ? (
                      <XCircle size={18} className="text-danger-500 shrink-0" />
                    ) : null
                  )}
                </button>
              );
            })}
          </div>

          {showExplanation && currentQ.explanation && (
            <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 text-xs text-brand-700 dark:text-brand-300">
              <strong>Explanation:</strong> {currentQ.explanation}
            </div>
          )}

          <div className="flex justify-between pt-2">
            <Button
              variant="secondary"
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              leftIcon={<ChevronLeft size={16} />}
            >
              Previous
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={userAnswer === undefined}
              rightIcon={<ChevronRight size={16} />}
            >
              {currentIndex === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTS STATE ──
  const finalScore = result ? result.score : Math.round((Object.keys(answers).length / questions.length) * 100);

  return (
    <div className="page-enter max-w-2xl mx-auto space-y-8 text-center">
      <div className="card p-8 space-y-6">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          Quiz Completed! 🎉
        </h2>

        <div className="flex justify-center my-4">
          <CircularProgress value={finalScore} size={120} strokeWidth={10}>
            <span className="text-2xl font-bold text-surface-900 dark:text-surface-100">
              {finalScore}%
            </span>
          </CircularProgress>
        </div>

        <p className="text-surface-600 dark:text-surface-300">
          {finalScore >= 80 ? 'Awesome work! You have a great grasp on this material.' : 'Good effort! Review the topics to score even higher.'}
        </p>

        <div className="flex justify-center gap-4">
          <Button variant="secondary" onClick={resetQuiz} leftIcon={<RotateCcw size={16} />}>
            Take Another Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
