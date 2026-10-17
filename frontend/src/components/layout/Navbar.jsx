import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Menu, X, ChevronDown, LogOut, User, Settings, BarChart3
} from 'lucide-react';
import { Button, ThemeToggle, Avatar } from '../ui';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
];

export function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Track scroll
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => setScrolled(window.scrollY > 20), { passive: true });
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-surface-900/95 backdrop-blur-xl border-b border-surface-700/50 shadow-lg'
          : 'bg-transparent'
      )}
    >
      <nav className="page-container flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center group-hover:shadow-brand transition-shadow">
            <Brain size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white">
            Study<span className="text-brand-400">AI</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm text-surface-300 hover:text-white rounded-xl hover:bg-white/10 transition-all"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle size="sm" />
          {isAuthenticated ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                className="text-surface-300 hover:text-white hover:bg-white/10"
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/register')}
              >
                Get Started Free
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-xl text-surface-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface-900/95 backdrop-blur-xl border-t border-surface-700/50"
          >
            <div className="page-container py-4 flex flex-col gap-2">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 text-sm text-surface-300 hover:text-white rounded-xl hover:bg-white/10 transition-all"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-2 mt-2 pt-2 border-t border-surface-700/50">
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onClick={() => { navigate('/login'); setMenuOpen(false); }}
                  className="text-surface-300"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => { navigate('/register'); setMenuOpen(false); }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// App Navbar (inside the authenticated layout)
export function AppNavbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [avatarOpen, setAvatarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-16 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-40">
      {/* Mobile menu trigger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-surface-500 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Logo — mobile only */}
      <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
        <Brain size={20} className="text-brand-500" />
        <span className="font-display font-bold text-surface-900 dark:text-surface-100">
          Study<span className="text-brand-500">AI</span>
        </span>
      </Link>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <ThemeToggle size="sm" />

        {/* Avatar menu */}
        <div className="relative">
          <button
            onClick={() => setAvatarOpen(!avatarOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <Avatar src={user?.avatar} name={user?.name} size="sm" />
            <ChevronDown
              size={14}
              className={cn(
                'text-surface-400 transition-transform duration-200',
                avatarOpen && 'rotate-180'
              )}
            />
          </button>

          <AnimatePresence>
            {avatarOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-700 overflow-hidden z-50"
              >
                {/* User info */}
                <div className="p-4 border-b border-surface-100 dark:border-surface-700">
                  <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                    {user?.name}
                  </p>
                  <p className="text-xs text-surface-400 mt-0.5">{user?.email}</p>
                </div>

                {/* Menu items */}
                {[
                  { icon: User, label: 'Profile', href: '/profile' },
                  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
                  { icon: Settings, label: 'Settings', href: '/settings' },
                ].map(item => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setAvatarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    <item.icon size={16} className="text-surface-400" />
                    {item.label}
                  </Link>
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-danger-500 hover:bg-danger-500/5 transition-colors border-t border-surface-100 dark:border-surface-700"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
