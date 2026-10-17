import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Trash2, Flame, Target, Clock, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button, Badge, ProgressBar } from '../components/ui';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { formatHours, getPriorityClasses } from '../utils';
import { plannerAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function PlannerPage() {
  const [planner, setPlanner] = useState({
    tasks: [],
    weeklyGoal: { targetHours: 28, completedHours: 0 },
    streak: { current: 0, longest: 0, weeklyData: [] },
  });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('General');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const loadPlanner = useCallback(async () => {
    try {
      const res = await plannerAPI.getPlanner();
      const pData = res.data?.data?.planner;
      if (pData) {
        setPlanner(pData);
      }
    } catch (err) {
      console.error('Failed to fetch planner:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlanner();
  }, [loadPlanner]);

  const toggleTask = async (taskId, currentCompleted) => {
    try {
      const res = await plannerAPI.updateTask(taskId, { completed: !currentCompleted });
      const updatedTask = res.data?.data?.task;
      if (updatedTask) {
        setPlanner(prev => ({
          ...prev,
          tasks: prev.tasks.map(t => t.id === taskId ? updatedTask : t),
        }));
      }
    } catch (err) {
      toast.error('Failed to update task.');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await plannerAPI.deleteTask(taskId);
      setPlanner(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== taskId),
      }));
      toast.success('Task removed');
    } catch (err) {
      toast.error('Failed to delete task.');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setCreating(true);
    try {
      const res = await plannerAPI.createTask({
        title: newTaskTitle.trim(),
        subject: newTaskSubject,
        priority: 'medium',
        estimatedHours: 2,
      });

      const createdTask = res.data?.data?.task;
      if (createdTask) {
        setPlanner(prev => ({
          ...prev,
          tasks: [createdTask, ...prev.tasks],
        }));
        setNewTaskTitle('');
        setShowTaskModal(false);
        toast.success('Task created successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task.');
    } finally {
      setCreating(false);
    }
  };

  const tasks = planner.tasks || [];
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const goal = planner.weeklyGoal || { targetHours: 28, completedHours: 0 };
  const streak = planner.streak || { current: 0, longest: 0, weeklyData: [] };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="space-y-8 page-enter max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-surface-100 mb-1">
            Study Planner
          </h1>
          <p className="text-surface-500 dark:text-surface-400">Plan, track, and achieve your learning goals</p>
        </div>
        <Button leftIcon={<Plus size={18} />} onClick={() => setShowTaskModal(true)}>
          Add Task
        </Button>
      </div>

      {/* Top stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Current Streak',
            value: `${streak.current || 0} days`,
            icon: Flame,
            sub: `Best: ${streak.longest || 0} days`,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
          },
          {
            label: 'Weekly Goal',
            value: `${formatHours(goal.completedHours || 0)}`,
            icon: Target,
            sub: `of ${formatHours(goal.targetHours || 28)} goal`,
            color: 'text-brand-500',
            bg: 'bg-brand-500/10',
          },
          {
            label: 'Tasks Done',
            value: `${completed}/${total}`,
            icon: Check,
            sub: `${total > 0 ? Math.round((completed / total) * 100) : 0}% complete`,
            color: 'text-success-500',
            bg: 'bg-success-500/10',
          },
          {
            label: 'Study Hours Logged',
            value: `${goal.completedHours || 0}h`,
            icon: Clock,
            sub: 'Keep it up!',
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
          },
        ].map(stat => (
          <div key={stat.label} className="card p-5">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs text-surface-500 dark:text-surface-400">{stat.label}</p>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon size={18} className={stat.color} />
              </div>
            </div>
            <p className="text-2xl font-bold font-display text-surface-900 dark:text-surface-100">{stat.value}</p>
            <p className="text-xs text-surface-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task list section */}
        <div className="lg:col-span-2 card p-6 space-y-4">
          <div className="section-header">
            <h2 className="section-title">Tasks ({tasks.length})</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-brand-500" size={24} />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-surface-400 text-sm">
              No tasks found. Add your first study task!
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map(t => (
                <div
                  key={t.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    t.completed
                      ? 'bg-surface-50 dark:bg-surface-800/50 border-surface-200 dark:border-surface-700 opacity-60'
                      : 'border-surface-200 dark:border-surface-700 hover:border-brand-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button
                      onClick={() => toggleTask(t.id, t.completed)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                        t.completed
                          ? 'bg-brand-500 border-brand-500 text-white'
                          : 'border-surface-300 dark:border-surface-600 hover:border-brand-500'
                      }`}
                    >
                      {t.completed && <Check size={14} />}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold text-surface-900 dark:text-surface-100 truncate ${t.completed ? 'line-through' : ''}`}>
                        {t.title}
                      </p>
                      <p className="text-xs text-surface-400 mt-0.5">
                        {t.subject || 'General'} • {t.estimatedHours || 1}h estimated
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={t.priority === 'high' ? 'danger' : t.priority === 'medium' ? 'warning' : 'success'} size="sm">
                      {t.priority || 'medium'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                      onClick={() => deleteTask(t.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weekly activity chart */}
        <div className="lg:col-span-1 card p-6 space-y-4">
          <h2 className="section-title">Weekly Activity</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={streak.weeklyData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="hours" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateTask} className="bg-surface-50 dark:bg-surface-900 rounded-3xl max-w-md w-full p-6 space-y-4 border border-surface-200 dark:border-surface-700">
            <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100">
              Create New Task
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-surface-700 dark:text-surface-300 block mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Read Chapter 4 of Physics"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-500 text-surface-900 dark:text-surface-100"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-surface-700 dark:text-surface-300 block mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g., Physics"
                  value={newTaskSubject}
                  onChange={e => setNewTaskSubject(e.target.value)}
                  className="w-full bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-500 text-surface-900 dark:text-surface-100"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" type="button" onClick={() => setShowTaskModal(false)}>Cancel</Button>
              <Button type="submit" isLoading={creating}>Save Task</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
