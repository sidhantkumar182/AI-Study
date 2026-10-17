import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Globe, ArrowRight } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    const success = await login(data.email, data.password);
    if (success) {
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-surface-900 dark:text-surface-100 mb-2">
          Welcome back 👋
        </h1>
        <p className="text-surface-500 dark:text-surface-400">
          Sign in to continue your learning journey
        </p>
      </div>

      {/* Google SSO */}
      <Button
        variant="secondary"
        size="lg"
        fullWidth
        leftIcon={<Globe size={18} />}
        className="mb-6"
        onClick={() => toast('Google sign-in coming soon!')}
      >
        Continue with Google
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
        <span className="text-xs text-surface-400">or sign in with email</span>
        <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          placeholder="e.g. alex@example.com"
          leftIcon={<Mail size={16} />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
          })}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          leftIcon={<Lock size={16} />}
          rightIcon={showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          onRightIconClick={() => setShowPassword(!showPassword)}
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
          })}
        />

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="w-4 h-4 rounded accent-brand-500"
            />
            <span className="text-sm text-surface-600 dark:text-surface-400">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          fullWidth
          isLoading={isLoading}
          rightIcon={!isLoading ? <ArrowRight size={18} /> : undefined}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {/* Register link */}
      <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-6">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700"
        >
          Create account
        </Link>
      </p>
    </motion.div>
  );
}
