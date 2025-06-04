'use client'

import { motion } from 'framer-motion'
import { HeroSection } from './hero-section'
import { DemoVideoSection } from './demo-video-section'
import { HowItWorksSection } from './how-it-works-section'
import { FeaturesSection } from './features-section'


import { CTASection } from './cta-section'
import { LazyLoad } from '@/components/ui/lazy-load'
import { LandingHeader } from './landing-header'
import { LandingFooter } from './landing-footer'

export function LandingPage() {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <LandingHeader />
      <main className="relative overflow-hidden">
        <HeroSection />

        <DemoVideoSection />

        <LazyLoad>
          <HowItWorksSection />
        </LazyLoad>

        <LazyLoad>
          <FeaturesSection />
        </LazyLoad>

        <CTASection />
      </main>
      <LandingFooter />
    </motion.div>
  )
}
