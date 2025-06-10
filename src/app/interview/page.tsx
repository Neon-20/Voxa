'use client'

import { InterviewLayout } from '@/components/layout/interview-layout'
import { MockInterview } from '@/components/interview/mock-interview'
import { RouteGuard } from '@/components/auth/route-guard'
import { Mic, MessageSquare, Target, Sparkles, Brain, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function InterviewPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])
  return (
    <RouteGuard requireAuth={true}>
      <InterviewLayout>
        <div className="space-y-12">
        {/* Compact Hero Section */}
        <div className={`relative bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl p-6 lg:p-8 overflow-hidden border border-purple-100/50 shadow-lg transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />

          {/* Floating particles animation */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-2 h-2 bg-purple-300/30 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
            <div className="absolute top-20 right-20 w-1 h-1 bg-blue-300/40 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
            <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-purple-400/20 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
          </div>

          <div className="relative">
            <div className="text-center mb-6">
              <div className={`inline-flex items-center gap-3 mb-4 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden hover:scale-110 transition-transform duration-300 cursor-pointer group">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-500 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>

                  {/* Sound wave pattern */}
                  <div className="relative flex items-center space-x-0.5">
                    <div className="w-0.5 h-3 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-0.5 h-5 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-0.5 h-4 bg-white/90 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                    <div className="w-0.5 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></div>
                    <div className="w-0.5 h-3 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
                  </div>
                </div>
                <div className="text-left">
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight hover:text-purple-700 transition-colors duration-300">
                    Voxa Mock Interview
                  </h1>
                  <p className="text-sm text-purple-600 font-medium animate-pulse">
                    AI-Powered Interview Practice
                  </p>
                </div>
              </div>

              <p className={`text-base text-gray-600 max-w-2xl mx-auto leading-relaxed mb-4 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                Practice real interviews with our advanced AI voice coach. Get instant feedback and ace your next interview.
              </p>

              {/* Compact success metrics */}
              <div className={`flex flex-wrap justify-center gap-6 text-xs text-gray-500 mb-4 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <span className="flex items-center gap-1 hover:scale-105 transition-transform duration-200 cursor-default">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  10,000+ successful interviews
                </span>
                <span className="flex items-center gap-1 hover:scale-105 transition-transform duration-200 cursor-default">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  95% user satisfaction
                </span>
                <span className="flex items-center gap-1 hover:scale-105 transition-transform duration-200 cursor-default">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  Trusted by Fortune 500
                </span>
              </div>
            </div>

            {/* Compact Feature Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm hover:shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300 group cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '900ms' }}>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Mic className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-purple-600 transition-colors duration-300">Voice-First Experience</h3>
                <p className="text-gray-600 text-xs leading-relaxed">Natural conversation flow with advanced voice AI</p>
              </div>

              <div className={`bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm hover:shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300 group cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '1100ms' }}>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors duration-300">Real-time Feedback</h3>
                <p className="text-gray-600 text-xs leading-relaxed">Instant performance insights and suggestions</p>
              </div>

              <div className={`bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm hover:shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300 group cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '1300ms' }}>
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-green-600 transition-colors duration-300">AI-Powered Analysis</h3>
                <p className="text-gray-600 text-xs leading-relaxed">Detailed analysis powered by Claude AI</p>
              </div>

              <div className={`bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm hover:shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300 group cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '1500ms' }}>
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-orange-600 transition-colors duration-300">15-Minute Sessions</h3>
                <p className="text-gray-600 text-xs leading-relaxed">Focused practice sessions optimized for learning</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <MockInterview />
        </div>

        {/* Professional Testimonial */}
        <div className={`bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-3xl p-8 lg:p-12 border border-blue-100/50 shadow-xl hover:shadow-2xl transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '1200ms' }}>
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="flex -space-x-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
                  S
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer" style={{ transitionDelay: '100ms' }}>
                  M
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer" style={{ transitionDelay: '200ms' }}>
                  A
                </div>
              </div>
            </div>

            <blockquote className="text-sm lg:text-base font-medium text-gray-900 mb-6 leading-relaxed hover:text-gray-700 transition-colors duration-300">
              "Voxa's mock interviews helped me land my dream job at Google. The AI feedback was incredibly detailed and helped me improve my communication skills significantly."
            </blockquote>

            <div className="text-gray-600 font-medium hover:text-gray-800 transition-colors duration-300">
              <div className="text-lg">Sarah Chen</div>
              <div className="text-sm">Software Engineer at Google</div>
            </div>

            <div className="flex justify-center items-center gap-8 mt-8 text-sm text-gray-500">
              <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-200 cursor-default">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span>4.9/5 average rating</span>
              </div>
              <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-200 cursor-default">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span>95% success rate</span>
              </div>
              <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-200 cursor-default">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span>10,000+ interviews</span>
              </div>
            </div>
          </div>
          </div>
        </div>
      </InterviewLayout>
    </RouteGuard>
  )
}
