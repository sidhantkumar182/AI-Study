import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Edit3, Save, X, Mail, User as UserIcon, BookOpen, Trophy, Flame, CreditCard } from 'lucide-react';
import { Button, Input, Badge } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils';
import { profileAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await profileAPI.updateProfile({ name, email });
      const updatedUser = res.data?.data?.user;
      if (updatedUser) {
        updateUser(updatedUser);
      } else {
        updateUser({ name, email });
      }
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const statCards = [
    { label: 'Study Hours', value: user.stats?.totalStudyHours || 0, icon: BookOpen, suffix: 'h', color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { label: 'Quizzes', value: user.stats?.quizzesTaken || 0, icon: Trophy, suffix: '', color: 'text-success-500', bg: 'bg-success-500/10' },
    { label: 'Flashcards', value: user.stats?.flashcardsReviewed || 0, icon: CreditCard, suffix: '', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Streak', value: user.stats?.currentStreak || 0, icon: Flame, suffix: 'd', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 page-enter">
      <div>
        <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-surface-100 mb-1">Profile</h1>
        <p className="text-surface-500 dark:text-surface-400">Manage your personal information</p>
      </div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        {/* Cover */}
        <div className="h-24 rounded-2xl bg-brand-gradient relative mb-16">
          <div className="absolute -bottom-10 left-6">
            <div className="relative group cursor-pointer">
              <div className="w-20 h-20 rounded-2xl border-4 border-white dark:border-surface-900 overflow-hidden bg-surface-200">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-brand-gradient flex items-center justify-center text-white font-bold text-xl">
                    {getInitials(user.name || 'User')}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera size={20} className="text-white" />
              </div>
            </div>
          </div>
          <div className="absolute right-4 bottom-4">
            <Button
              variant="glass"
              size="sm"
              leftIcon={editing ? <X size={14} /> : <Edit3 size={14} />}
              onClick={() => { setEditing(!editing); if (editing) { setName(user.name); setEmail(user.email); } }}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">{user.name}</h2>
              <Badge variant={user.plan === 'pro' ? 'brand' : 'neutral'} size="sm">
                {user.plan === 'pro' ? '⚡ Pro' : 'Free'}
              </Badge>
            </div>
            <p className="text-surface-500 dark:text-surface-400 text-sm">{user.email}</p>
            <p className="text-xs text-surface-400 mt-1">
              Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <Badge variant="success" dot size="md">Active</Badge>
        </div>

        {/* Edit form */}
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700 space-y-4"
          >
            <Input
              label="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              leftIcon={<UserIcon size={16} />}
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              leftIcon={<Mail size={16} />}
            />
            <Button onClick={handleSave} isLoading={saving} leftIcon={<Save size={16} />}>
              Save Changes
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card p-4 text-center"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className="text-xl font-bold text-surface-900 dark:text-surface-100">
              {stat.value.toLocaleString()}{stat.suffix}
            </p>
            <p className="text-xs text-surface-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
