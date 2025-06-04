'use client'

import { useState } from 'react'
import { Play, Pause, Volume2, Maximize } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/animated-section'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Predefined values to avoid hydration mismatch
const WAVEFORM_BARS_MAIN = [
  { height: 55, duration: 2.98 },
  { height: 72, duration: 2.23 },
  { height: 76, duration: 2.30 },
  { height: 43, duration: 2.58 },
  { height: 61, duration: 2.55 },
  { height: 61, duration: 1.43 },
  { height: 74, duration: 2.85 },
  { height: 45, duration: 1.24 },
  { height: 77, duration: 1.26 },
  { height: 29, duration: 1.58 },
  { height: 67, duration: 2.88 },
  { height: 62, duration: 2.63 },
  { height: 42, duration: 1.77 },
  { height: 63, duration: 1.34 },
  { height: 78, duration: 1.69 }
]

const WAVEFORM_BARS_MODAL = [
  { height: 35, duration: 1.2 },
  { height: 28, duration: 0.9 },
  { height: 42, duration: 1.5 },
  { height: 31, duration: 1.1 },
  { height: 38, duration: 1.3 },
  { height: 25, duration: 0.8 },
  { height: 45, duration: 1.4 },
  { height: 33, duration: 1.0 },
  { height: 40, duration: 1.6 },
  { height: 27, duration: 0.7 },
  { height: 36, duration: 1.2 },
  { height: 44, duration: 1.3 },
  { height: 29, duration: 0.9 },
  { height: 41, duration: 1.5 },
  { height: 34, duration: 1.1 },
  { height: 39, duration: 1.4 },
  { height: 26, duration: 0.8 },
  { height: 43, duration: 1.6 },
  { height: 32, duration: 1.0 },
  { height: 37, duration: 1.2 }
]

export function DemoVideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)

  const handlePlayDemo = () => {
    setIsPlaying(true)
    setShowVideoModal(true)
  }

  const handleCloseModal = () => {
    setIsPlaying(false)
    setShowVideoModal(false)
  }

  return (
    <section id="demo-video-section" className="pt-8 pb-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-4">
            Experience Voice-Powered Mock Interviews
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Listen to real voice conversations with Voxa. Hear how natural voice interactions
            powered by Vapi create realistic interview practice that feels like talking to a real interviewer.
          </p>
        </AnimatedSection>

        {/* Main Demo Video */}
        <AnimatedSection animation="scaleIn" delay={0.2}>
          <div className="max-w-3xl mx-auto mb-16">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-purple-100">
              {/* Video Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

                {/* Animated Voice Waveform Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <div className="flex items-end gap-2">
                    {WAVEFORM_BARS_MAIN.map((bar, i) => (
                      <div
                        key={i}
                        className="w-2 bg-purple-400 rounded-full animate-pulse"
                        style={{
                          height: `${bar.height}px`,
                          animationDelay: `${i * 0.15}s`,
                          animationDuration: `${bar.duration}s`
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-8 left-8 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>Live Voice AI</span>
                  </div>
                </div>

                <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-white text-sm font-medium">2:15 Demo</div>
                </div>

                <div className="absolute bottom-20 left-8 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 max-w-xs">
                  <div className="text-white text-sm">
                    <div className="font-medium mb-1">Sample Question:</div>
                    <div className="text-gray-300 text-xs">&quot;Tell me about your greatest weakness&quot;</div>
                  </div>
                </div>

                {/* Play Button */}
                <motion.button
                  onClick={handlePlayDemo}
                  className="relative z-10 group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-28 h-28 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-300 border border-white/30">
                    <Play className="h-12 w-12 text-purple-600 ml-1" />
                  </div>
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-30" />
                  <div className="absolute -inset-4 bg-white/10 rounded-full animate-ping opacity-20" style={{ animationDelay: '0.5s' }} />
                </motion.button>

                {/* Demo Preview Content */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">Mock Interview Demo</h3>
                        <p className="text-sm text-gray-300">Real Vapi-powered interview practice</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Volume2 className="h-4 w-4" />
                        <span>Audio: 2:15</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Corner Badge */}
                <div className="absolute top-6 right-6">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Powered by Vapi
                  </div>
                </div>
              </div>

              {/* Video Controls Preview */}
              <div className="bg-white p-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Play className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Volume2 className="h-5 w-5 text-gray-600" />
                    </button>
                    <div className="text-sm text-gray-500">0:00 / 2:15</div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Maximize className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>





        {/* CTA */}
        <AnimatedSection animation="fadeInUp" delay={0.8}>
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Practice Your Interview Skills?
              </h3>
              <p className="text-gray-600 mb-6">
                Start practicing today and get personalized AI mock interview coaching in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all text-center"
                >
                  Start Mock Interview
                </Link>
                <button 
                  onClick={handlePlayDemo}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Watch Demo Again
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full">
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-gray-900">Voxa Platform Demo</h3>
                <button 
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="aspect-video bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

                {/* Floating Voice Waveform Animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-end gap-1 opacity-20">
                    {WAVEFORM_BARS_MODAL.map((bar, i) => (
                      <div
                        key={i}
                        className="w-1 bg-purple-400 rounded-full animate-pulse"
                        style={{
                          height: `${bar.height}px`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: `${bar.duration}s`
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-white text-center relative z-10">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                      <Play className="h-10 w-10 text-white ml-1" />
                    </div>
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                      <span className="text-sm font-medium">Live Voice Demo</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2">Voxa Mock Interview Demo</h3>
                  <p className="text-gray-300 mb-4 max-w-md mx-auto">
                    Watch a real mock interview session between a user and Voxa&apos;s AI interviewer
                  </p>

                  {/* Demo Features */}
                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-sm">
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <div className="font-semibold text-purple-300">🎙️ Natural Speech</div>
                      <div className="text-gray-400 text-xs">Real voice interaction</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <div className="font-semibold text-blue-300">🧠 AI Interviewer</div>
                      <div className="text-gray-400 text-xs">Smart questions</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <div className="font-semibold text-green-300">⚡ Instant Feedback</div>
                      <div className="text-gray-400 text-xs">Real-time analysis</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <div className="font-semibold text-yellow-300">🎯 Role-Specific</div>
                      <div className="text-gray-400 text-xs">Targeted practice</div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-6 italic">
                    🎬 Ready for your demo video showcasing Vapi voice interactions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
