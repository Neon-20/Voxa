'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/animated-section'

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-6">
            Transform Your Interview Performance Today
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Join 10,000+ professionals who have mastered their interview skills with Voxa&apos;s
            AI-powered mock interviews. Practice with personalized questions and get instant feedback.
          </p>

          {/* Enhanced CTA with urgency */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Link
              href="/interview"
              className="group inline-flex items-center px-10 py-5 bg-white text-purple-600 rounded-2xl font-bold text-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl"
            >
              <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
                <Sparkles className="h-4 w-4 text-purple-600" />
              </div>
              Start Your Mock Interview
              <ArrowRight className="h-5 w-5 ml-3 transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="text-center">
              <div className="text-blue-100 text-sm font-medium mb-1">
                ✨ No credit card required • Free to start
              </div>
              <div className="text-blue-200 text-xs">
                🚀 Get results in 15 minutes
              </div>
            </div>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap justify-center gap-8 text-blue-200 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>95% interview success rate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span>Average 40% confidence boost</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <span>Used by Fortune 500 employees</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
