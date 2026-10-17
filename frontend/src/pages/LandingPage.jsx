import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, ArrowRight, Play, Star, Check, Zap,
  MessageSquare, HelpCircle, CreditCard, BarChart3, Calendar,
  Upload, Sparkles, ChevronRight
} from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { LandingNavbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { mockTestimonials, mockPricingPlans, mockFeatures } from '../mock';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const iconMap = {
  MessageSquare, Brain, HelpCircle, CreditCard, Calendar, BarChart3,
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-950 text-white">
      <LandingNavbar />

      {/* ====== HERO ====== */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="bg-dots absolute inset-0 opacity-40" />
        <div className="glow-orb w-[600px] h-[600px] bg-brand-600 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25 animate-pulse-slow" />
        <div className="glow-orb w-80 h-80 bg-accent-500 bottom-0 right-0 opacity-20 animate-float" />

        <div className="page-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Launch badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-sm font-medium mb-8"
            >
              <Sparkles size={14} />
              Introducing StudyAI — AI-Powered Learning Platform
              <ChevronRight size={14} />
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance"
            >
              Study Smarter with
              <br />
              <span className="gradient-text-animated">AI as Your Tutor</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-xl text-surface-300 max-w-2xl mx-auto mb-10 text-balance"
            >
              Upload any PDF and instantly get AI-powered summaries, quizzes, flashcards,
              and a 24/7 AI tutor who knows your material inside out.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="xl"
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight size={20} />}
                className="text-base shadow-brand-lg hover:shadow-brand-lg"
              >
                Start Learning Free
              </Button>
              <button className="flex items-center gap-3 text-surface-300 hover:text-white transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Play size={18} className="text-white ml-0.5" />
                </div>
                <span className="text-sm font-medium">Watch demo (2 min)</span>
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="flex items-center justify-center gap-6 mt-12 flex-wrap"
            >
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`}
                    className="w-8 h-8 rounded-full border-2 border-surface-950 bg-surface-800"
                    alt=""
                  />
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
                <span className="ml-2 text-sm text-surface-300">
                  <strong className="text-white">4.9</strong> from 50,000+ students
                </span>
              </div>
            </motion.div>
          </div>

          {/* Hero visual — dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 relative"
          >
            <div className="relative max-w-5xl mx-auto">
              {/* Glow */}
              <div className="absolute inset-0 bg-brand-gradient rounded-3xl blur-2xl opacity-20 scale-105" />

              {/* Mock dashboard preview */}
              <div className="relative rounded-3xl border border-white/10 overflow-hidden bg-surface-900/80 backdrop-blur-xl shadow-[0_40px_120px_rgba(99,102,241,0.3)]">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-surface-900 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/60" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                    <div className="w-3 h-3 rounded-full bg-green-400/60" />
                  </div>
                  <div className="flex-1 mx-4 h-6 rounded-md bg-white/5 flex items-center px-3">
                    <span className="text-xs text-surface-500">app.studyai.io/dashboard</span>
                  </div>
                </div>

                {/* Dashboard mini preview */}
                <div className="grid grid-cols-12 min-h-[400px]">
                  {/* Sidebar */}
                  <div className="col-span-2 border-r border-white/5 p-3 space-y-1 hidden md:block">
                    {['Dashboard', 'Chat PDF', 'Summary', 'Quiz', 'Flashcards', 'Planner'].map((item, i) => (
                      <div
                        key={item}
                        className={`h-7 rounded-lg flex items-center px-2 text-xs ${i === 0 ? 'bg-brand-500/20 text-brand-400' : 'text-surface-500'}`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="col-span-12 md:col-span-10 p-6 space-y-4">
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: 'Study Hours', val: '148h', color: '#6366f1' },
                        { label: 'Quiz Score', val: '85%', color: '#22c55e' },
                        { label: 'Flashcards', val: '312', color: '#f59e0b' },
                        { label: 'Streak', val: '7 days', color: '#d946ef' },
                      ].map(stat => (
                        <div key={stat.label} className="bg-white/5 rounded-xl p-3">
                          <p className="text-xs text-surface-500">{stat.label}</p>
                          <p className="text-lg font-bold mt-1" style={{ color: stat.color }}>
                            {stat.val}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-xl p-4 h-36 flex flex-col gap-2">
                        <div className="text-xs text-surface-400">Recent Uploads</div>
                        {['Machine Learning.pdf', 'Calculus Chapter 5.pdf', 'Organic Chemistry.pdf'].map(f => (
                          <div key={f} className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-brand-500/20 flex-shrink-0" />
                            <span className="text-xs text-surface-400 truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 h-36">
                        <div className="text-xs text-surface-400 mb-2">Study Progress</div>
                        <div className="space-y-2">
                          {[80, 65, 45].map((w, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 rounded-full bg-white/5">
                                <div className="h-full rounded-full bg-brand-500/70" style={{ width: `${w}%` }} />
                              </div>
                              <span className="text-xs text-surface-500">{w}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section id="features" className="py-24 bg-surface-900">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge variant="brand" size="md" className="mb-4">Features</Badge>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              Everything you need to{' '}
              <span className="gradient-text">ace any subject</span>
            </h2>
            <p className="text-surface-400 text-lg max-w-2xl mx-auto">
              Six powerful AI tools that work together to make studying more effective and enjoyable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockFeatures.map((feature, i) => {
              const Icon = iconMap[feature.icon] || Brain;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-500/40 hover:bg-white/8 transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-surface-400 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section id="how-it-works" className="py-24">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="brand" size="md" className="mb-4">How It Works</Badge>
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Get started in <span className="gradient-text">3 simple steps</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                icon: Upload,
                title: 'Upload Your Material',
                description: 'Drag & drop any PDF — textbooks, notes, papers. Our AI processes it in seconds.',
                color: 'from-brand-500 to-brand-700',
              },
              {
                step: '02',
                icon: Sparkles,
                title: 'AI Does the Magic',
                description: 'Instantly generate summaries, flashcards, quizzes, and have an AI tutor ready.',
                color: 'from-accent-500 to-accent-700',
              },
              {
                step: '03',
                icon: Zap,
                title: 'Study & Ace Exams',
                description: 'Use your personalized study tools and analytics to maximize retention.',
                color: 'from-amber-500 to-orange-600',
              },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] right-[-40%] h-px bg-gradient-to-r from-white/20 to-transparent" />
                )}
                <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-brand`}>
                  <step.icon size={32} className="text-white" />
                </div>
                <div className="text-xs font-bold text-brand-400 mb-2">STEP {step.step}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-surface-400 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section id="testimonials" className="py-24 bg-surface-900">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="brand" size="md" className="mb-4">Testimonials</Badge>
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Loved by <span className="gradient-text">50,000+ students</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTestimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-500/30 transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, si) => (
                    <Star key={si} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-surface-300 text-sm leading-relaxed mb-5">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full bg-surface-700"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-surface-400">
                      {t.role} • {t.university}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PRICING ====== */}
      <section id="pricing" className="py-24">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="brand" size="md" className="mb-4">Pricing</Badge>
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Simple, <span className="gradient-text">transparent pricing</span>
            </h2>
            <p className="text-surface-400">No credit card required to start. Upgrade when you're ready.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {mockPricingPlans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-8 rounded-3xl border transition-all duration-300 ${
                  plan.popular
                    ? 'border-brand-500/50 bg-brand-500/5'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1 rounded-full bg-brand-gradient text-white text-xs font-bold shadow-brand">
                      ✦ Most Popular
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-surface-400 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-bold text-white">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-surface-400 mb-2">/{plan.period}</span>
                    )}
                    {plan.price === 0 && (
                      <span className="text-surface-400 mb-2">/{plan.period}</span>
                    )}
                  </div>
                </div>

                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  size="lg"
                  fullWidth
                  onClick={() => navigate('/register')}
                  className={!plan.popular ? 'border-white/20 text-white hover:bg-white/10' : ''}
                >
                  {plan.cta}
                </Button>

                <ul className="mt-6 space-y-3">
                  {plan.features.map(feature => (
                    <li key={feature.label} className="flex items-start gap-3">
                      <div className={`mt-0.5 shrink-0 ${feature.included ? 'text-success-400' : 'text-surface-600'}`}>
                        {feature.included ? <Check size={16} /> : <span className="text-lg leading-none">–</span>}
                      </div>
                      <span className={`text-sm ${feature.included ? 'text-surface-300' : 'text-surface-600'}`}>
                        {feature.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA BANNER ====== */}
      <section className="py-24">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-16 text-center"
          >
            <div className="absolute inset-0 bg-brand-gradient opacity-90" />
            <div className="bg-dots absolute inset-0 opacity-20" />
            <div className="relative z-10">
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to transform your learning?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Join 50,000+ students who study smarter with AI. Start free today — no credit card needed.
              </p>
              <Button
                size="xl"
                onClick={() => navigate('/register')}
                className="bg-white text-brand-700 hover:bg-surface-100 shadow-2xl"
                rightIcon={<ArrowRight size={20} />}
              >
                Start Learning Free
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
