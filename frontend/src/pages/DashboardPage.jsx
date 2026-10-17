import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload, MessageSquare, FileText, HelpCircle, CreditCard,
  Calendar, TrendingUp, Clock, Target,
  ArrowRight, Flame, BookOpen
} from 'lucide-react';
import { Badge, ProgressBar, CircularProgress } from '../components/ui';
import { SkeletonDashboard } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, pdfAPI, chatAPI, plannerAPI } from '../utils/api';
import { formatRelativeTime, formatBytes, formatHours } from '../utils';

const quickActions = [
  { icon: Upload, label: 'Upload PDF', href: '/upload', color: 'bg-brand-500/10 text-brand-600 dark:text-brand-400', border: 'border-brand-500/20' },
  { icon: MessageSquare, label: 'Chat with PDF', href: '/chat', color: 'bg-accent-500/10 text-accent-600 dark:text-accent-400', border: 'border-accent-500/20' },
  { icon: HelpCircle, label: 'Generate Quiz', href: '/quiz', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', border: 'border-amber-500/20' },
  { icon: CreditCard, label: 'Flashcards', href: '/flashcards', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20' },
  { icon: FileText, label: 'AI Summary', href: '/summary', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400', border: 'border-pink-500/20' },
  { icon: Calendar, label: 'Study Planner', href: '/planner', color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400', border: 'border-violet-500/20' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalStudyHours: 0,
    totalDocuments: 0,
    totalFlashcards: 0,
    totalQuizzesTaken: 0,
    quizAccuracy: 0,
    averageDailyHours: 0,
    topicsCompleted: 0,
    currentStreak: 0,
  });
  const [recentPDFs, setRecentPDFs] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [plannerData, setPlannerData] = useState({ tasks: [], weeklyGoal: { targetHours: 28, completedHours: 0 } });

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const [dashRes, pdfRes, chatRes, plannerRes] = await Promise.allSettled([
          analyticsAPI.getDashboard(),
          pdfAPI.list({ limit: 4 }),
          chatAPI.listConversations(),
          plannerAPI.getPlanner(),
        ]);

        if (!isMounted) return;

        if (dashRes.status === 'fulfilled' && dashRes.value.data?.data?.stats) {
          setDashboardStats(dashRes.value.data.data.stats);
        }
        if (pdfRes.status === 'fulfilled' && pdfRes.value.data?.data?.documents) {
          setRecentPDFs(pdfRes.value.data.data.documents);
        }
        if (chatRes.status === 'fulfilled' && chatRes.value.data?.data?.conversations) {
          setRecentChats(chatRes.value.data.data.conversations.slice(0, 3));
        }
        if (plannerRes.status === 'fulfilled' && plannerRes.value.data?.data?.planner) {
          setPlannerData(plannerRes.value.data.data.planner);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();
    return () => { isMounted = false; };
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return <SkeletonDashboard />;

  const stats = [
    {
      label: 'Total Study Hours',
      value: formatHours(dashboardStats.totalStudyHours),
      sub: `${dashboardStats.averageDailyHours}h daily avg`,
      icon: Clock,
      color: 'text-brand-500',
      bg: 'bg-brand-500/10',
    },
    {
      label: 'Quiz Accuracy',
      value: `${dashboardStats.quizAccuracy}%`,
      sub: `${dashboardStats.totalQuizzesTaken} quizzes taken`,
      icon: Target,
      color: 'text-success-500',
      bg: 'bg-success-500/10',
    },
    {
      label: 'Flashcards Mastered',
      value: dashboardStats.totalFlashcards.toLocaleString(),
      sub: 'All decks',
      icon: CreditCard,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Study Streak',
      value: `${dashboardStats.currentStreak} days`,
      sub: `Current active streak`,
      icon: Flame,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
  ];

  const pendingTasks = (plannerData.tasks || []).filter(t => !t.completed).slice(0, 4);
  const targetHours = plannerData.weeklyGoal?.targetHours || 28;
  const completedHours = plannerData.weeklyGoal?.completedHours || dashboardStats.totalStudyHours || 0;
  const goalProgress = Math.min(Math.round((completedHours / targetHours) * 100), 100);

  return (
    <div className="space-y-8 page-enter">
      {/* ── Greeting ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-surface-900 dark:text-surface-100">
              {greeting()}, {user?.name?.split(' ')[0] || 'Student'} 👋
            </h1>
            <p className="text-surface-500 dark:text-surface-400 mt-1">
              Ready to learn? You've studied{' '}
              <strong className="text-brand-600 dark:text-brand-400">
                {formatHours(completedHours)}
              </strong>{' '}
              this week.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800">
            <Flame size={16} className="text-orange-500" />
            <span className="text-sm font-semibold text-brand-700 dark:text-brand-400">
              {dashboardStats.currentStreak} day streak 🔥
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={i + 1}
            className="card p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-medium text-surface-500 dark:text-surface-400">{stat.label}</p>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon size={18} className={stat.color} />
              </div>
            </div>
            <p className="text-2xl font-bold font-display text-surface-900 dark:text-surface-100">
              {stat.value}
            </p>
            <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className={`card-interactive p-4 flex flex-col items-center gap-2 text-center border ${action.border}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                <action.icon size={20} />
              </div>
              <span className="text-xs font-medium text-surface-700 dark:text-surface-300 leading-tight">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ── Main content grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Uploads */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6} className="lg:col-span-2">
          <div className="card p-5">
            <div className="section-header">
              <h2 className="section-title">Recent Uploads</h2>
              <Link to="/upload" className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {recentPDFs.length === 0 ? (
                <div className="text-center py-6 text-surface-400 text-sm">
                  No documents uploaded yet. Upload a PDF to get started!
                </div>
              ) : (
                recentPDFs.map(pdf => (
                  <div
                    key={pdf.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors cursor-pointer group"
                  >
                    <div className="w-10 h-12 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center shrink-0">
                      <BookOpen size={20} className="text-brand-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {pdf.title || pdf.originalName}
                      </p>
                      <p className="text-xs text-surface-400 mt-0.5">
                        {pdf.pageCount || '?'} pages • {formatBytes(pdf.fileSize)} • {formatRelativeTime(pdf.createdAt)}
                      </p>
                    </div>
                    <Badge
                      variant={pdf.status === 'ready' ? 'success' : pdf.status === 'processing' ? 'warning' : 'danger'}
                      dot
                    >
                      {pdf.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>

        {/* Learning Progress */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7} className="space-y-4">
          {/* Weekly goal */}
          <div className="card p-5">
            <h2 className="section-title mb-4">Weekly Goal</h2>
            <div className="flex items-center gap-4 mb-4">
              <CircularProgress
                value={goalProgress}
                size={80}
                strokeWidth={7}
              >
                <span className="text-xs font-bold text-surface-900 dark:text-surface-100">
                  {goalProgress}%
                </span>
              </CircularProgress>
              <div>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                  {formatHours(completedHours)}
                </p>
                <p className="text-xs text-surface-400">of {targetHours}h goal</p>
                <p className="text-xs text-success-500 mt-1 font-medium">On track! ✓</p>
              </div>
            </div>
            <ProgressBar
              value={completedHours}
              max={targetHours}
              variant="gradient"
              size="sm"
            />
          </div>

          {/* Stats */}
          <div className="card p-5">
            <h2 className="section-title mb-4">Today's Stats</h2>
            <div className="space-y-3">
              {[
                { label: 'Total documents', value: dashboardStats.totalDocuments, icon: Upload },
                { label: 'Topics done', value: dashboardStats.topicsCompleted, icon: TrendingUp },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon size={14} className="text-surface-400" />
                    <span className="text-sm text-surface-600 dark:text-surface-400">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Upcoming Tasks ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={8}>
        <div className="card p-5">
          <div className="section-header">
            <h2 className="section-title">Upcoming Tasks</h2>
            <Link to="/planner" className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1">
              View planner <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pendingTasks.length === 0 ? (
              <div className="col-span-full text-center py-4 text-surface-400 text-sm">
                No upcoming tasks. Add tasks in the study planner!
              </div>
            ) : (
              pendingTasks.map(task => (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl border border-surface-100 dark:border-surface-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: task.color || '#3b82f6' }}
                    />
                    <Badge
                      variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success'}
                      size="sm"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-surface-900 dark:text-surface-100 mb-1 line-clamp-2">
                    {task.title}
                  </p>
                  <p className="text-xs text-surface-400">{task.subject || 'General'}</p>
                  <p className="text-xs text-surface-400 mt-1 flex items-center gap-1">
                    <Clock size={10} /> {task.estimatedHours}h estimated
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Recent Chats ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={9}>
        <div className="card p-5">
          <div className="section-header">
            <h2 className="section-title">Recent AI Chats</h2>
            <Link to="/chat" className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1">
              All chats <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recentChats.length === 0 ? (
              <div className="col-span-full text-center py-4 text-surface-400 text-sm">
                No recent chats found. Start a conversation with a PDF!
              </div>
            ) : (
              recentChats.map(chat => (
                <Link
                  key={chat.id}
                  to={`/chat?id=${chat.id}`}
                  className="p-4 rounded-2xl border border-surface-100 dark:border-surface-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mb-3">
                    <MessageSquare size={16} className="text-brand-500" />
                  </div>
                  <p className="text-sm font-medium text-surface-900 dark:text-surface-100 mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {chat.title}
                  </p>
                  <p className="text-xs text-surface-400 truncate">{chat.pdfTitle || 'Document'}</p>
                  <p className="text-xs text-surface-400 mt-1">{chat.messageCount || 0} messages</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
