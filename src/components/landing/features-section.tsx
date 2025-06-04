'use client'

import { FileText, MessageSquare, Target, Lightbulb, Mic } from 'lucide-react'
import { AnimatedSection, AnimatedCard } from '@/components/ui/animated-section'

const features = [
  {
    icon: Mic,
    title: "Voice Interview Practice",
    description: "Practice real interviews with AI interviewers through natural voice conversations. Get instant feedback on your responses, tone, and confidence - powered by Vapi's advanced voice technology.",
    benefits: ["Natural voice conversations", "Real-time tone analysis", "Confidence coaching", "Industry-specific questions"],
    color: "bg-purple-500"
  },
  {
    icon: MessageSquare,
    title: "AI-Generated Questions",
    description: "Get personalized interview questions based on your target role and experience level. Practice with questions tailored to your specific career goals.",
    benefits: ["Role-specific questions", "Difficulty adaptation", "Comprehensive coverage", "Real interview scenarios"],
    color: "bg-blue-500"
  },
  {
    icon: FileText,
    title: "Resume-Based Questions",
    description: "Upload your resume and get interview questions specifically designed around your experience, skills, and background.",
    benefits: ["Personalized questions", "Experience-focused", "Skill validation", "Background exploration"],
    color: "bg-green-500"
  },
  {
    icon: Target,
    title: "Performance Analytics",
    description: "Track your interview performance over time with detailed analytics, scoring, and improvement recommendations.",
    benefits: ["Performance tracking", "Detailed scoring", "Progress insights", "Improvement tips"],
    color: "bg-orange-500"
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-4">
            Advanced Mock Interview Features
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Master your interview skills with AI-powered practice sessions that simulate real interview experiences
          </p>
        </AnimatedSection>

        {/* Sliding Features Carousel */}
        <div className="relative overflow-hidden">
          <div className="flex animate-slide-infinite gap-6">
            {/* First set of features */}
            {features.map((feature, index) => (
              <div key={`first-${index}`} className="flex-shrink-0 w-80">
                <AnimatedCard className="group p-6 bg-white/50 backdrop-blur-sm border border-gray-100 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {features.map((feature, index) => (
              <div key={`second-${index}`} className="flex-shrink-0 w-80">
                <AnimatedCard className="group p-6 bg-white/50 backdrop-blur-sm border border-gray-100 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
