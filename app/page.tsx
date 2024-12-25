'use client'

import { motion } from 'framer-motion'
import { ArrowRightIcon, SparklesIcon, ShieldCheckIcon, HeartIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-base-content mb-6">
              Share Your Story,
              <span className="text-primary"> Anonymously</span>
            </h1>
            <p className="text-xl text-base-content/60 mb-8 max-w-2xl mx-auto">
              A safe space to share your thoughts, feelings, and experiences without judgment.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center gap-4"
          >
            <Link 
              href="/admin/auth" 
              className="group flex items-center gap-2 px-6 py-3 bg-primary text-primary-content rounded-full text-lg font-medium hover:bg-primary/90 transition-all"
            >
              Admin Login
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-12 flex flex-wrap justify-center gap-8"
          >
            <div className="flex items-center gap-2 text-base-content/60">
              <SparklesIcon className="w-5 h-5 text-primary" />
              <span>100% Anonymous</span>
            </div>
            <div className="flex items-center gap-2 text-base-content/60">
              <ShieldCheckIcon className="w-5 h-5 text-primary" />
              <span>Safe & Secure</span>
            </div>
            <div className="flex items-center gap-2 text-base-content/60">
              <HeartIcon className="w-5 h-5 text-primary" />
              <span>Supportive Community</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-base-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-base-content mb-4">
              Why Choose Confessit?
            </h2>
            <p className="text-xl text-base-content/60">
              Express yourself freely in a safe and supportive environment
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-base-200 hover:bg-base-300 transition-colors"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${feature.iconBg}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-base-content mb-2">
                  {feature.title}
                </h3>
                <p className="text-base-content/60">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-base-200">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-base-content mb-4">
              How It Works
            </h2>
            <p className="text-xl text-base-content/60">
              Share your story in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-base-content mb-2">
                    {step.title}
                  </h3>
                  <p className="text-base-content/60">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRightIcon className="hidden md:block absolute top-12 -right-4 w-8 h-8 text-base-content/20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    title: 'Complete Anonymity',
    description: 'Share without revealing your identity. Your privacy is our top priority.',
    icon: <SparklesIcon className="w-6 h-6 text-primary" />,
    iconBg: 'bg-primary/10'
  },
  {
    title: 'Safe Environment',
    description: 'A moderated space free from harassment and harmful content.',
    icon: <ShieldCheckIcon className="w-6 h-6 text-primary" />,
    iconBg: 'bg-primary/10'
  },
  {
    title: 'Supportive Community',
    description: 'Connect with others who understand and support your journey.',
    icon: <HeartIcon className="w-6 h-6 text-primary" />,
    iconBg: 'bg-primary/10'
  }
]

const steps = [
  {
    title: 'Login as Admin',
    description: 'Access the admin dashboard to manage confessions.'
  },
  {
    title: 'Create Confession',
    description: 'Write and submit confessions through the admin interface.'
  },
  {
    title: 'Manage & Share',
    description: 'Review, moderate, and share confessions with the community.'
  }
]