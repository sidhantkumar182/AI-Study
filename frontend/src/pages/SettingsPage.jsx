import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Palette, Globe, Bell, Shield, Download, Trash2,
  ChevronRight, Moon, Sun, Monitor, Check
} from 'lucide-react';
import { Button, ThemeToggle, Badge } from '../components/ui';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const themeOptions = [
  { id: 'light', label: 'Light', icon: Sun, desc: 'Clean and bright' },
  { id: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes' },
  { id: 'system', label: 'System', icon: Monitor, desc: 'Follows device setting' },
];

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'zh', label: '中文' },
  { code: 'ar', label: 'العربية' },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState('en');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    studyReminders: true,
    weeklyReport: true,
  });

  const toggleNotif = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Setting updated');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Signed out successfully');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 page-enter">
      <div>
        <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-surface-100 mb-1">Settings</h1>
        <p className="text-surface-500 dark:text-surface-400">Manage your account preferences</p>
      </div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center">
            <Palette size={18} className="text-brand-500" />
          </div>
          <h2 className="font-semibold text-surface-900 dark:text-surface-100">Appearance</h2>
        </div>

        <div>
          <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">Theme</p>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => {
                  if (opt.id !== 'system') setTheme(opt.id);
                  toast.success(`${opt.label} theme applied`);
                }}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  theme === opt.id
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                    : 'border-surface-200 dark:border-surface-700 hover:border-surface-300'
                }`}
              >
                <opt.icon
                  size={22}
                  className={`mx-auto mb-2 ${theme === opt.id ? 'text-brand-500' : 'text-surface-400'}`}
                />
                <p className={`text-sm font-medium ${theme === opt.id ? 'text-brand-700 dark:text-brand-400' : 'text-surface-700 dark:text-surface-300'}`}>
                  {opt.label}
                </p>
                <p className="text-xs text-surface-400 mt-0.5">{opt.desc}</p>
                {theme === opt.id && (
                  <div className="mt-2 flex justify-center">
                    <div className="w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center">
                      <Check size={10} className="text-white" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-surface-100 dark:border-surface-700">
          <div>
            <p className="text-sm font-medium text-surface-900 dark:text-surface-100">Theme Toggle</p>
            <p className="text-xs text-surface-400">Quick switch</p>
          </div>
          <ThemeToggle />
        </div>
      </motion.div>

      {/* Language */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Globe size={18} className="text-emerald-500" />
          </div>
          <h2 className="font-semibold text-surface-900 dark:text-surface-100">Language & Region</h2>
        </div>
        <div>
          <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">Interface Language</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => { setSelectedLang(lang.code); toast.success(`Language set to ${lang.label}`); }}
                className={`px-3 py-2.5 rounded-xl border text-sm transition-all ${
                  selectedLang === lang.code
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium'
                    : 'border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:border-surface-300'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Bell size={18} className="text-amber-500" />
          </div>
          <h2 className="font-semibold text-surface-900 dark:text-surface-100">Notifications</h2>
        </div>
        <div className="space-y-4">
          {Object.keys(notifications).map(key => {
            const labels = {
              email: { label: 'Email Notifications', desc: 'Receive updates via email' },
              push: { label: 'Push Notifications', desc: 'Browser & mobile alerts' },
              studyReminders: { label: 'Study Reminders', desc: 'Daily reminders to meet your goals' },
              weeklyReport: { label: 'Weekly Report', desc: 'Summary of your weekly progress' },
            };
            return (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{labels[key].label}</p>
                  <p className="text-xs text-surface-400">{labels[key].desc}</p>
                </div>
                <button
                  onClick={() => toggleNotif(key)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${notifications[key] ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-600'}`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifications[key] ? 'translate-x-5' : 'translate-x-0.5'}`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Privacy */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <Shield size={18} className="text-violet-500" />
          </div>
          <h2 className="font-semibold text-surface-900 dark:text-surface-100">Privacy & Account</h2>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => toast.success('Export started! (UI Demo)')}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-surface-200 dark:border-surface-700 hover:border-surface-300 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Download size={18} className="text-surface-400" />
              <div className="text-left">
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100">Export My Data</p>
                <p className="text-xs text-surface-400">Download all your data as JSON</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-surface-400 group-hover:text-surface-600" />
          </button>

          <button
            onClick={() => toast.error('Account deletion: contact support')}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-danger-200 dark:border-danger-900/50 bg-danger-50 dark:bg-danger-900/10 hover:bg-danger-100 dark:hover:bg-danger-900/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Trash2 size={18} className="text-danger-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-danger-700 dark:text-danger-400">Delete Account</p>
                <p className="text-xs text-danger-500/70">Permanently delete your account and data</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-danger-400" />
          </button>
        </div>
      </motion.div>

      {/* Plan info */}
      <div className="card p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">Current Plan</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={user?.plan === 'pro' ? 'brand' : 'neutral'} size="sm">
              {user?.plan === 'pro' ? '⚡ Pro Plan' : 'Free Plan'}
            </Badge>
          </div>
        </div>
        {user?.plan === 'free' && (
          <Button size="sm" onClick={() => toast.success('Upgrade flow coming soon!')}>
            Upgrade to Pro
          </Button>
        )}
      </div>

      {/* Sign out */}
      <Button
        variant="secondary"
        fullWidth
        size="lg"
        onClick={handleLogout}
        className="border-danger-200 dark:border-danger-900/50 text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20"
      >
        Sign Out
      </Button>
    </div>
  );
}
