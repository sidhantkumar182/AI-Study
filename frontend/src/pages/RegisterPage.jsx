import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register: registerAuth, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    const success = await registerAuth(data.name, data.email, data.password, data.confirmPassword);
    if (success) {
      toast.success('Account created! Welcome to StudyAI 🎉');
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
          Create your account ✨
        </h1>
        <p className="text-surface-500 dark:text-surface-400">
          Join students learning smarter with AI
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full name"
          type="text"
          placeholder="Alex Johnson"
          leftIcon={<User size={16} />}
          error={errors.name?.message}
          {...register('name', {
            required: 'Full name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          })}
        />

        <Input
          label="Email address"
          type="email"
          placeholder="alex@example.com"
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
          placeholder="Create a strong password"
          leftIcon={<Lock size={16} />}
          rightIcon={showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          onRightIconClick={() => setShowPassword(!showPassword)}
          error={errors.password?.message}
          hint="Must contain at least 8 characters, 1 uppercase letter, and 1 number"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
            pattern: {
              value: /^(?=.*[A-Z])(?=.*\d)/,
              message: 'Must include at least 1 uppercase letter and 1 number',
            },
          })}
        />

        {/* Password strength indicator */}
        {watch('password') && (
          <div className="flex gap-1 -mt-1">
            {['weak', 'fair', 'good', 'strong'].map((level, i) => {
              const pw = watch('password') || '';
              const strength = Math.min(
                [pw.length >= 8, /[A-Z]/.test(pw), /\d/.test(pw), /[^a-zA-Z0-9]/.test(pw)].filter(Boolean).length,
                4
              );
              return (
                <div
                  key={level}
                  className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
                    i < strength
                      ? ['bg-danger-500', 'bg-warning-500', 'bg-amber-400', 'bg-success-500'][strength - 1]
                      : 'bg-surface-200 dark:bg-surface-700'
                  }`}
                />
              );
            })}
          </div>
        )}

        <Input
          label="Confirm password"
          type={showConfirm ? 'text' : 'password'}
          placeholder="Confirm your password"
          leftIcon={<Lock size={16} />}
          rightIcon={showConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
          onRightIconClick={() => setShowConfirm(!showConfirm)}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />

        {/* Terms */}
        <p className="text-xs text-surface-500 dark:text-surface-400">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-brand-500 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-brand-500 hover:underline">Privacy Policy</a>.
        </p>

        <Button
          type="submit"
          size="lg"
          fullWidth
          isLoading={isLoading}
          rightIcon={!isLoading ? <ArrowRight size={18} /> : undefined}
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      {/* Login link */}
      <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-6">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
