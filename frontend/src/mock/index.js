// Central export for all mock data
export * from './users';
export * from './pdfs';
export * from './chats';
export * from './summaries';
export * from './quizzes';
export * from './flashcards';
export * from './planner';
export * from './analytics';

// Landing page mock data
export const mockTestimonials = [
  {
    id: 't_001',
    name: 'Priya Sharma',
    role: 'Medical Student',
    university: 'Johns Hopkins University',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    rating: 5,
    content:
      'StudyAI transformed how I prepare for boards. The AI explanations are so clear — like having a tutor available 24/7. My USMLE Step 1 score improved by 28 points!',
  },
  {
    id: 't_002',
    name: 'Marcus Williams',
    role: 'CS Graduate Student',
    university: 'MIT',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    rating: 5,
    content:
      'The chat-with-PDF feature is incredible. I upload research papers and ask the AI to explain concepts at different depths. It\'s like having a research assistant who never sleeps.',
  },
  {
    id: 't_003',
    name: 'Emma Rodriguez',
    role: 'Pre-Law Student',
    university: 'Harvard',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    rating: 5,
    content:
      'The flashcard system is brilliant. It automatically creates cards from my case law readings and the flip animation makes studying actually enjoyable. My GPA went from 3.4 to 3.9.',
  },
  {
    id: 't_004',
    name: 'James Kim',
    role: 'Engineering Student',
    university: 'Stanford',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    rating: 5,
    content:
      'Quiz generation is a game changer. It automatically creates practice exams from my textbooks at exactly the right difficulty. I saved 6 hours a week on exam prep.',
  },
  {
    id: 't_005',
    name: 'Aisha Patel',
    role: 'MBA Student',
    university: 'Wharton',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
    rating: 5,
    content:
      'The analytics dashboard showed me I was spending too much time on easy topics. After adjusting my study plan based on the insights, my case competition performance improved dramatically.',
  },
  {
    id: 't_006',
    name: 'Lucas Ferreira',
    role: 'Data Science Student',
    university: 'Carnegie Mellon',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas',
    rating: 4,
    content:
      'Finally a study tool that understands technical content. The AI accurately explains complex statistics and ML papers. The code block formatting in chat is a nice touch.',
  },
];

export const mockPricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started',
    color: 'surface',
    features: [
      { label: '5 PDF uploads per month', included: true },
      { label: 'AI Chat (50 messages/month)', included: true },
      { label: 'Basic summaries', included: true },
      { label: '10 flashcards per deck', included: true },
      { label: 'Quiz generation (5/month)', included: true },
      { label: 'Study planner', included: true },
      { label: 'Advanced analytics', included: false },
      { label: 'Unlimited PDFs', included: false },
      { label: 'Priority AI responses', included: false },
      { label: 'Export & download', included: false },
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 12,
    period: 'month',
    description: 'For serious students',
    color: 'brand',
    features: [
      { label: 'Unlimited PDF uploads', included: true },
      { label: 'Unlimited AI Chat', included: true },
      { label: 'Advanced AI summaries', included: true },
      { label: 'Unlimited flashcard decks', included: true },
      { label: 'Unlimited quiz generation', included: true },
      { label: 'Full study planner', included: true },
      { label: 'Advanced analytics & insights', included: true },
      { label: 'Priority AI responses', included: true },
      { label: 'Export (PDF, Anki, CSV)', included: true },
      { label: 'Collaboration features', included: true },
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
];

export const mockFeatures = [
  {
    id: 'f_001',
    icon: 'MessageSquare',
    title: 'Chat with Your PDFs',
    description: 'Have natural conversations with any document. Ask questions, get explanations, and explore concepts at your own pace.',
    gradient: 'from-brand-500 to-brand-700',
  },
  {
    id: 'f_002',
    icon: 'Brain',
    title: 'AI-Powered Summaries',
    description: 'Instantly generate comprehensive summaries with key terms, concepts, and bullet points extracted from your materials.',
    gradient: 'from-accent-500 to-accent-700',
  },
  {
    id: 'f_003',
    icon: 'HelpCircle',
    title: 'Smart Quiz Generation',
    description: 'Automatically create MCQ quizzes at your chosen difficulty level. Track scores and review explanations.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'f_004',
    icon: 'CreditCard',
    title: 'Interactive Flashcards',
    description: 'Generate study flashcards with beautiful flip animations. Shuffle, bookmark, and track your progress.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'f_005',
    icon: 'Calendar',
    title: 'Study Planner',
    description: 'Plan your study sessions, track streaks, set weekly goals, and stay consistent with a built-in calendar.',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    id: 'f_006',
    icon: 'BarChart3',
    title: 'Learning Analytics',
    description: 'Visualize your progress with detailed charts, heatmaps, and performance insights to optimize your study habits.',
    gradient: 'from-violet-500 to-purple-700',
  },
];
