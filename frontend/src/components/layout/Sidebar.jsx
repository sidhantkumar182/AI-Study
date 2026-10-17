import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, LayoutDashboard, Upload, MessageSquare, FileText,
  HelpCircle, CreditCard, Calendar, BarChart3, User, Settings,
  X, Sparkles, ChevronRight, Zap
} from 'lucide-react';
import { cn } from '../../utils';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Upload, label: 'Upload PDF', href: '/upload' },
  { icon: MessageSquare, label: 'Chat with PDF', href: '/chat', badge: '3' },
  { icon: FileText, label: 'AI Summary', href: '/summary' },
  { icon: HelpCircle, label: 'Quiz Generator', href: '/quiz' },
  { icon: CreditCard, label: 'Flashcards', href: '/flashcards' },
  { icon: Calendar, label: 'Study Planner', href: '/planner' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
];

const bottomItems = [
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user } = useAuth();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-surface-200 dark:border-surface-700">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center group-hover:shadow-brand transition-shadow">
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-surface-900 dark:text-surface-100">
              Study<span className="text-brand-500">AI</span>
            </span>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Plan Badge */}
      {user?.plan === 'pro' && (
        <div className="mx-4 mt-4 px-3 py-2 rounded-xl bg-brand-gradient flex items-center gap-2">
          <Zap size={14} className="text-white" />
          <span className="text-xs font-semibold text-white">Pro Plan Active</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-1">
        <p className="px-3 text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-2">
          Study Tools
        </p>
        {navItems.map(item => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={cn(
                'sidebar-item group',
                isActive && 'active'
              )}
            >
              <item.icon
                size={18}
                className={cn(
                  'shrink-0 transition-colors',
                  isActive ? 'text-brand-600 dark:text-brand-400' : 'text-surface-400 group-hover:text-surface-600 dark:group-hover:text-surface-200'
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge variant="brand" size="sm">{item.badge}</Badge>
              )}
              {isActive && (
                <ChevronRight size={14} className="text-brand-500 shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-1 border-t border-surface-200 dark:border-surface-700 pt-4">
        <p className="px-3 text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-2">
          Account
        </p>
        {bottomItems.map(item => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={cn('sidebar-item', isActive && 'active')}
            >
              <item.icon size={18} className="shrink-0 text-surface-400" />
              {item.label}
            </Link>
          );
        })}

        {/* Upgrade prompt (free plan) */}
        {user?.plan === 'free' && (
          <div className="mx-1 mt-3 p-3 rounded-2xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-brand-500" />
              <span className="text-xs font-semibold text-brand-700 dark:text-brand-400">
                Upgrade to Pro
              </span>
            </div>
            <p className="text-xs text-surface-500 dark:text-surface-400 mb-2">
              Get unlimited AI, PDFs & analytics
            </p>
            <Link
              to="/settings"
              className="block w-full text-center text-xs font-semibold py-1.5 rounded-lg bg-brand-gradient text-white hover:shadow-brand transition-shadow"
            >
              Upgrade Now →
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-surface-900 z-50 lg:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
