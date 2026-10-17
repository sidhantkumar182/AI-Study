import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, Target, BookOpen, Zap, Loader2 } from 'lucide-react';
import { Tabs, TabPanel, ProgressBar } from '../components/ui';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { analyticsAPI } from '../utils/api';
import { formatHours } from '../utils';

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const tooltipStyle = {
  backgroundColor: 'rgb(30,41,59)',
  border: '1px solid rgb(51,65,85)',
  borderRadius: '12px',
  fontSize: 12,
  color: '#e2e8f0',
};

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadOverview() {
      try {
        const res = await analyticsAPI.getOverview();
        if (res.data?.success && res.data?.data) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load analytics overview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOverview();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={14} /> },
    { id: 'performance', label: 'Performance', icon: <TrendingUp size={14} /> },
    { id: 'topics', label: 'Topics', icon: <BookOpen size={14} /> },
    { id: 'heatmap', label: 'Activity', icon: <Zap size={14} /> },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    );
  }

  const dash = data?.dashboard || { totalStudyHours: 0, quizAccuracy: 0, averageDailyHours: 0, topicsCompleted: 0 };
  const studyHours = data?.studyHours || [];
  const quizAccuracy = data?.quizAccuracy || [];
  const weeklyPerformance = data?.weeklyPerformance || [];
  const subjectDistribution = data?.subjectDistribution || [];
  const topicsCompleted = data?.topicsCompleted || [];
  const heatmap = data?.heatmap || [];

  const stats = [
    { label: 'Total Study Hours', value: formatHours(dash.totalStudyHours), icon: Clock, color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { label: 'Quiz Accuracy', value: `${dash.quizAccuracy}%`, icon: Target, color: 'text-success-500', bg: 'bg-success-500/10' },
    { label: 'Avg Daily Hours', value: `${dash.averageDailyHours}h`, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Topics Completed', value: dash.topicsCompleted, icon: BookOpen, color: 'text-accent-500', bg: 'bg-accent-500/10' },
  ];

  return (
    <div className="space-y-8 page-enter max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-surface-100 mb-1">
          Learning Analytics
        </h1>
        <p className="text-surface-500 dark:text-surface-400">
          Track your progress and optimize your study habits
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card p-5"
          >
            <div className="flex justify-between mb-3">
              <p className="text-xs text-surface-500 dark:text-surface-400">{stat.label}</p>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon size={18} className={stat.color} />
              </div>
            </div>
            <p className="text-2xl font-bold font-display text-surface-900 dark:text-surface-100">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <Tabs items={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pill" />

      {/* Overview */}
      <TabPanel activeTab={activeTab} tabId="overview">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Study hours trend */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-4">Study Hours Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={studyHours}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}h`, 'Hours']} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#areaGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quiz accuracy */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-4">Quiz Accuracy Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={quizAccuracy}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Accuracy']} />
                <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </TabPanel>

      {/* Performance */}
      <TabPanel activeTab={activeTab} tabId="performance">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-4">Weekly Performance Breakdown</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="hours" fill="#6366f1" radius={[6, 6, 0, 0]} name="Hours" />
              <Bar dataKey="quizzes" fill="#22c55e" radius={[6, 6, 0, 0]} name="Quizzes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabPanel>

      {/* Topics */}
      <TabPanel activeTab={activeTab} tabId="topics">
        <div className="card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">Topic Mastery</h3>
          {topicsCompleted.length === 0 ? (
            <p className="text-xs text-surface-400 py-4">No topics completed yet.</p>
          ) : (
            topicsCompleted.map((topic, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-surface-800 dark:text-surface-200">{topic.topic || topic.name}</span>
                  <span className="text-surface-500">{topic.mastery || topic.score || 85}%</span>
                </div>
                <ProgressBar value={topic.mastery || topic.score || 85} max={100} size="sm" variant="gradient" />
              </div>
            ))
          )}
        </div>
      </TabPanel>

      {/* Activity */}
      <TabPanel activeTab={activeTab} tabId="heatmap">
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-4">Activity Stream</h3>
          <p className="text-xs text-surface-400">Total days recorded: {heatmap.length}</p>
        </div>
      </TabPanel>
    </div>
  );
}
