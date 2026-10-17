import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        {/* Animated 404 */}
        <div className="relative mb-8">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="text-[120px] font-display font-black leading-none select-none"
          >
            <span className="gradient-text-animated">4</span>
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
              className="inline-block text-surface-700"
            >
              0
            </motion.span>
            <span className="gradient-text-animated">4</span>
          </motion.div>

          {/* Decorative circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-brand-500/10 animate-spin-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-accent-500/5 animate-pulse-slow" />
        </div>

        <h1 className="font-display text-3xl font-bold text-white mb-3">
          Page not found
        </h1>
        <p className="text-surface-400 text-lg mb-8">
          Looks like you've ventured into uncharted territory. This page doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button size="lg" leftIcon={<Home size={18} />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<ArrowLeft size={18} />}
              className="border-surface-700 text-surface-300 hover:bg-surface-800"
            >
              Go to Dashboard
            </Button>
          </Link>
        </div>

        {/* Helpful links */}
        <div className="mt-10 p-5 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-sm font-medium text-surface-300 mb-3">Quick links:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Upload PDF', href: '/upload' },
              { label: 'Chat with AI', href: '/chat' },
              { label: 'Quiz Generator', href: '/quiz' },
            ].map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-surface-300 hover:text-white hover:bg-white/20 text-sm transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
