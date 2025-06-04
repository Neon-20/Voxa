'use client'

import { MessageSquare, Brain, Mic, Trophy } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/animated-section'

const steps = [
  {
    icon: MessageSquare,
    title: "Upload Resume & Select Role",
    description: "Upload your resume and choose the job role you want to practice for. Our AI will analyze your background to create personalized questions.",
    color: "bg-blue-500"
  },
  {
    icon: Brain,
    title: "AI Generates Questions",
    description: "Our advanced AI creates role-specific interview questions tailored to your experience level and target position.",
    color: "bg-purple-500"
  },
  {
    icon: Mic,
    title: "Practice Voice Interviews",
    description: "Engage in realistic interview simulations with voice AI. Practice speaking naturally and get real-time feedback on your responses.",
    color: "bg-green-500"
  },
  {
    icon: Trophy,
    title: "Get Detailed Feedback",
    description: "Receive comprehensive analysis of your performance including scoring, improvement tips, and areas to focus on for your next interview.",
    color: "bg-orange-500"
  }
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-4">
            How Voxa Mock Interview Works
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our simple 4-step process helps you master interview skills with AI-powered voice practice sessions
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <AnimatedSection
                key={index}
                animation="fadeInUp"
                delay={index * 0.2}
                className="relative"
              >
                {/* Connection line with animation */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0 animate-pulse" />
                )}

                <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 group hover:scale-105 hover:-translate-y-2">
                  {/* Step number with bounce animation */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold group-hover:animate-bounce">
                    {index + 1}
                  </div>

                  {/* Icon with rotation animation */}
                  <div className={`w-12 h-12 ${step.color} rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110`}>
                    <step.icon className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-125" />
                  </div>

                  {/* Content with slide animation */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 transition-colors duration-300 group-hover:text-purple-600">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-gray-700">
                    {step.description}
                  </p>

                  {/* Animated background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10"></div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
