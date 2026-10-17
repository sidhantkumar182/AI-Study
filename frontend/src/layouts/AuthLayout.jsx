import { Outlet, Link } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { ThemeToggle } from '../components/ui';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Background decorations */}
        <div className="glow-orb w-96 h-96 bg-brand-500 -top-24 -left-24 animate-pulse-slow" />
        <div className="glow-orb w-64 h-64 bg-accent-500 bottom-0 right-0 animate-float" />
        <div className="bg-dots absolute inset-0" />

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Brain size={28} className="text-white" />
            </div>
            <span className="font-display font-bold text-3xl text-white">
              Study<span className="text-brand-300">AI</span>
            </span>
          </div>

          <h1 className="text-4xl font-display font-bold text-white mb-4 text-balance">
            Learn Smarter,<br />
            <span className="gradient-text-animated">Not Harder</span>
          </h1>
          <p className="text-surface-300 text-lg max-w-sm">
            AI-powered study tools to help you understand, remember, and excel in any subject.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12">
            {[
              { label: 'Students', value: '50K+' },
              { label: 'PDFs Analyzed', value: '2M+' },
              { label: 'Quizzes Taken', value: '8M+' },
            ].map(stat => (
              <div
                key={stat.label}
                className="glass p-4 rounded-2xl text-center"
              >
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-surface-300 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-6">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <Brain size={20} className="text-brand-500" />
            <span className="font-display font-bold text-surface-900 dark:text-surface-100">
              Study<span className="text-brand-500">AI</span>
            </span>
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
