'use client'

import Link from 'next/link'
import { ArrowRight, Mic, MicOff, Volume2, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatedSection, AnimatedButton } from '@/components/ui/animated-section'
import { useRef, useState, useCallback, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import {
  startVapiSession,
  stopVapiSession,
  setupVapiEventHandlers,
  cleanupVapiEventHandlers
} from '@/lib/vapi'

export function HeroSection() {
  const ref = useRef(null)

  // Voice session state
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [voiceTranscript, setVoiceTranscript] = useState('')

  // Voice functionality handlers
  const handleCallStart = useCallback(() => {
    setIsRecording(true)
    setIsConnecting(false)
    toast.success('🎙️ Voice session started! Say hello to your AI career coach.')
  }, [])

  const handleCallEnd = useCallback(async () => {
    setIsRecording(false)
    setIsVoiceActive(false)
    setIsSpeaking(false)
    setIsConnecting(false)

    // Optionally save the landing page voice session
    try {
      await fetch('/api/voice/landing-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionType: 'careerQA',
          transcript: voiceTranscript,
          duration: null, // Could track duration if needed
          userAgent: navigator.userAgent,
          ipAddress: null // Would need additional service to get IP
        }),
      })
    } catch (error) {
      console.log('Failed to save landing session (non-critical):', error)
    }

    toast.success('Voice session ended. Thanks for trying Voxa!')
  }, [voiceTranscript])

  const handleSpeechStart = useCallback(() => {
    setIsSpeaking(true)
  }, [])

  const handleSpeechEnd = useCallback(() => {
    setIsSpeaking(false)
  }, [])

  const handleMessage = useCallback((message: unknown) => {
    console.log('Hero Vapi message:', message)
  }, [])

  const handleError = useCallback((error: unknown) => {
    console.error('Hero Vapi error:', error)
    toast.error('Voice session error. Please try again.')
    setIsRecording(false)
    setIsVoiceActive(false)
    setIsSpeaking(false)
    setIsConnecting(false)
  }, [])

  const handleTranscript = useCallback((transcript: { transcript?: string }) => {
    if (transcript.transcript) {
      setVoiceTranscript(transcript.transcript)
    }
  }, [])

  // Setup voice event handlers
  useEffect(() => {
    if (isVoiceActive) {
      setupVapiEventHandlers(
        handleCallStart,
        handleCallEnd,
        handleSpeechStart,
        handleSpeechEnd,
        handleMessage,
        handleError,
        handleTranscript
      )

      return () => {
        cleanupVapiEventHandlers()
      }
    }
  }, [isVoiceActive, handleCallStart, handleCallEnd, handleSpeechStart, handleSpeechEnd, handleMessage, handleError, handleTranscript])

  // Start voice session
  const startVoiceSession = async () => {
    try {
      setIsConnecting(true)
      setIsVoiceActive(true)
      setVoiceTranscript('')
      await startVapiSession('careerQA')
    } catch (error) {
      toast.error('Failed to start voice session. Please try again.')
      setIsConnecting(false)
      setIsVoiceActive(false)
      console.error('Voice session error:', error)
    }
  }

  // Stop voice session
  const stopVoiceSession = async () => {
    try {
      await stopVapiSession()
      setIsVoiceActive(false)
      setIsRecording(false)
      setIsSpeaking(false)
      setIsConnecting(false)
    } catch (error) {
      console.error('Failed to stop voice session:', error)
    }
  }

  // Get current voice state for UI
  const getVoiceState = () => {
    if (isConnecting) return 'connecting'
    if (isSpeaking) return 'speaking'
    if (isRecording) return 'recording'
    if (isVoiceActive) return 'active'
    return 'idle'
  }

  const voiceState = getVoiceState()

  // Get button content based on voice state
  const getButtonContent = () => {
    switch (voiceState) {
      case 'connecting':
        return {
          icon: Loader2,
          text: 'Connecting...',
          className: 'animate-spin'
        }
      case 'speaking':
        return {
          icon: Volume2,
          text: 'AI Speaking...',
          className: 'text-blue-400'
        }
      case 'recording':
        return {
          icon: Mic,
          text: 'Listening...',
          className: 'text-red-400 animate-pulse'
        }
      case 'active':
        return {
          icon: MicOff,
          text: 'End Session',
          className: 'text-red-400'
        }
      default:
        return {
          icon: Mic,
          text: 'Start Voice Session',
          className: ''
        }
    }
  }

  const buttonContent = getButtonContent()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 sm:py-32"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <AnimatedSection animation="fadeInDown">
            <motion.div
              className="mb-8 inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-6 py-3 text-sm font-medium text-purple-700 border border-purple-200/50 shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-5 h-5 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <Mic className="h-3 w-3 text-white" />
              </div>
              #1 AI Mock Interview Platform • Powered by Vapi
            </motion.div>
          </AnimatedSection>

          {/* Main headline */}
          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Master Interviews with{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Voxa AI Mock Interviews</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection animation="fadeInUp" delay={0.4}>
            <p className="mb-6 text-lg leading-7 text-gray-600 sm:text-xl max-w-3xl mx-auto">
              Practice with Voxa's advanced AI interviewer. Get personalized questions, real-time feedback, and build confidence for your dream job interview.
            </p>

            {/* Success metrics */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">10,000+ interviews practiced</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span className="font-medium">95% success rate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span className="font-medium">15-minute focused sessions</span>
              </div>
            </div>
          </AnimatedSection>

          {/* CTA Buttons */}
          <AnimatedSection animation="fadeInUp" delay={0.6}>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              {/* Primary CTA - Start Mock Interview */}
              <Link href="/interview">
                <AnimatedButton
                  className="group inline-flex items-center rounded-2xl px-10 py-5 text-lg font-bold shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white hover:from-purple-700 hover:via-purple-800 hover:to-blue-700"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-white/30 transition-colors">
                    <Mic className="h-4 w-4" />
                  </div>
                  Start Mock Interview
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </AnimatedButton>
              </Link>

              {/* Secondary CTA - Voice Demo */}
              <AnimatedButton
                className={`group inline-flex items-center rounded-2xl px-8 py-4 text-base font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 ${
                  voiceState === 'idle'
                    ? 'border-2 border-purple-300 bg-white text-purple-700 hover:bg-purple-50'
                    : voiceState === 'active' || voiceState === 'recording' || voiceState === 'speaking'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                    : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                }`}
                onClick={voiceState === 'idle' ? startVoiceSession : stopVoiceSession}
                disabled={voiceState === 'connecting'}
              >
                <buttonContent.icon className={`mr-2 h-5 w-5 ${buttonContent.className}`} />
                {voiceState === 'idle' ? 'Try Voice Demo' : buttonContent.text}
              </AnimatedButton>
            </div>

            {/* Trust indicators */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 mb-2">Trusted by professionals at</p>
              <div className="flex justify-center items-center gap-8 opacity-60">
                <div className="text-lg font-bold text-gray-400">Google</div>
                <div className="text-lg font-bold text-gray-400">Microsoft</div>
                <div className="text-lg font-bold text-gray-400">Amazon</div>
                <div className="text-lg font-bold text-gray-400">Meta</div>
              </div>
            </div>

            {/* Voice Status Indicator */}
            {isVoiceActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 max-w-md mx-auto"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-purple-200">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className={`p-2 rounded-full ${
                      isSpeaking ? 'bg-blue-100' :
                      isRecording ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {isSpeaking ? (
                        <Volume2 className="h-4 w-4 text-blue-600" />
                      ) : isRecording ? (
                        <Mic className="h-4 w-4 text-green-600" />
                      ) : (
                        <MicOff className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 text-sm">
                        {isSpeaking ? 'AI Speaking...' : isRecording ? 'Listening...' : 'Voice Session Active'}
                      </div>
                      <div className="text-xs text-gray-600">
                        {isRecording ? 'Try saying "Hello" or ask about your career' : 'Voice AI is ready to help'}
                      </div>
                    </div>
                  </div>

                  {voiceTranscript && (
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <div className="text-xs font-medium text-purple-700 mb-1">You said:</div>
                      <div className="text-sm text-gray-800">{voiceTranscript}</div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
