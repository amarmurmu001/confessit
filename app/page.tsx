import ConfessionForm from '@/components/ConfessionForm'
import Navigation from '@/components/Navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Confessit - Share Your Secrets',
  description: 'A safe space for sharing anonymous confessions',
}

export default function Home() {
  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <section className="min-h-screen bg-base-200 pt-16 flex items-center">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Share Your Story,
                <span className="text-primary"> Anonymously</span>
              </h1>
              <p className="text-xl text-base-content/70 mb-8">
                A safe space to express yourself freely, share your thoughts, and connect with others through anonymous confessions.
              </p>
              <a href="#confess" className="btn btn-primary btn-lg">
                Share Your Confession
              </a>
            </div>
            <div className="relative">
              <div className="aspect-square bg-primary/10 rounded-full absolute -top-4 -right-4 animate-pulse"></div>
              <div className="aspect-video bg-base-100 rounded-2xl shadow-xl p-8 relative">
                <div className="space-y-4">
                  <div className="h-4 bg-base-300 rounded-full w-3/4"></div>
                  <div className="h-4 bg-base-300 rounded-full w-1/2"></div>
                  <div className="h-4 bg-base-300 rounded-full w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose Confessit</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Complete Anonymity',
                description: 'Share your thoughts without revealing your identity. Your privacy is our top priority.',
                icon: '🔒'
              },
              {
                title: 'Safe Space',
                description: 'A supportive community where you can express yourself without judgment.',
                icon: '💭'
              },
              {
                title: 'Easy to Use',
                description: 'Simple and intuitive interface makes sharing your confessions effortless.',
                icon: '✨'
              }
            ].map((feature, index) => (
              <div key={index} className="card bg-base-200 hover:shadow-xl transition-shadow">
                <div className="card-body text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-base-content/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Write Your Confession',
                description: 'Share your thoughts, experiences, or secrets in our simple confession form.'
              },
              {
                step: '02',
                title: 'Choose Anonymity',
                description: 'Decide whether to share your name or remain completely anonymous.'
              },
              {
                step: '03',
                title: 'Submit & Connect',
                description: 'Your confession will be shared with our community after moderation.'
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-primary/20 absolute -top-8 left-0">
                  {step.step}
                </div>
                <div className="pt-8">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-base-content/70">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Confession Form Section */}
      <section id="confess" className="py-24 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-3xl font-bold text-center mb-6">Share Your Confession</h2>
                <p className="text-center text-base-content/70 mb-8">
                  Your story matters. Share it with our supportive community.
                </p>
                <ConfessionForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-200 border-t border-base-300">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-base-content/70">
              © {new Date().getFullYear()} Confessit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}