'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, Square, Mic, MicOff, MessageSquare, Star, Volume2, Upload, FileText, Briefcase, Clock, User, Bot } from 'lucide-react'
import { ResumeUpload } from '@/components/ui/resume-upload'
import { toast } from 'react-hot-toast'
import {
  startVapiSession,
  stopVapiSession,
  setupVapiEventHandlers,
  cleanupVapiEventHandlers,
  isVapiActive
} from '@/lib/vapi'

interface Question {
  question: string
  type: string
}

interface InterviewSession {
  id: string
  role: string
  transcript: string | null
  feedback: string | null
  score: number | null
  duration: number | null
  created_at: string
}

interface InterviewData {
  jobDescription: string
  resume: string
  role: string
}

// Interview stages
type InterviewStage = 'setup' | 'interview' | 'completed'

export function MockInterview() {
  // Interview stage management
  const [currentStage, setCurrentStage] = useState<InterviewStage>('setup')
  const [interviewData, setInterviewData] = useState<InterviewData>({
    jobDescription: '',
    resume: '',
    role: ''
  })
  const [isTrialMode, setIsTrialMode] = useState(false)

  // Sample data for trial mode
  const sampleData = {
    role: 'Frontend Developer',
    jobDescription: `We are seeking a talented Frontend Developer to join our dynamic team. The ideal candidate will have experience with modern JavaScript frameworks, responsive design, and a passion for creating exceptional user experiences.

Key Responsibilities:
• Develop and maintain responsive web applications using React.js and Next.js
• Collaborate with designers to implement pixel-perfect UI/UX designs
• Optimize applications for maximum speed and scalability
• Write clean, maintainable, and well-documented code
• Participate in code reviews and contribute to team best practices
• Work closely with backend developers to integrate APIs
• Stay up-to-date with the latest frontend technologies and trends

Required Skills:
• 2+ years of experience with React.js and modern JavaScript (ES6+)
• Proficiency in HTML5, CSS3, and responsive design principles
• Experience with state management libraries (Redux, Zustand, or Context API)
• Familiarity with build tools (Webpack, Vite) and version control (Git)
• Knowledge of RESTful APIs and asynchronous programming
• Understanding of web performance optimization techniques
• Strong problem-solving skills and attention to detail

Preferred Qualifications:
• Experience with TypeScript and Next.js
• Knowledge of testing frameworks (Jest, React Testing Library)
• Familiarity with CSS preprocessors (Sass, Less) or CSS-in-JS solutions
• Experience with design systems and component libraries
• Understanding of accessibility standards (WCAG)
• Bachelor's degree in Computer Science or related field

We offer competitive salary, comprehensive benefits, flexible work arrangements, and opportunities for professional growth in a collaborative environment.`,
    resume: `John Smith
Frontend Developer
Email: john.smith@email.com | Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johnsmith | GitHub: github.com/johnsmith

PROFESSIONAL SUMMARY
Passionate Frontend Developer with 3+ years of experience building responsive web applications using React.js, Next.js, and modern JavaScript. Proven track record of delivering high-quality user interfaces and optimizing application performance. Strong collaborator with excellent problem-solving skills and a keen eye for detail.

TECHNICAL SKILLS
• Frontend: React.js, Next.js, JavaScript (ES6+), TypeScript, HTML5, CSS3
• Styling: Tailwind CSS, Styled Components, Sass, CSS Modules
• State Management: Redux Toolkit, Zustand, Context API
• Tools & Build: Webpack, Vite, npm/yarn, Git, VS Code
• Testing: Jest, React Testing Library, Cypress
• APIs: RESTful APIs, GraphQL, Axios, Fetch API
• Other: Responsive Design, Web Performance, Accessibility (WCAG)

PROFESSIONAL EXPERIENCE

Frontend Developer | TechStart Solutions | Jan 2022 - Present
• Developed and maintained 5+ React.js applications serving 10,000+ daily active users
• Implemented responsive designs that improved mobile user engagement by 35%
• Optimized application performance, reducing initial load time by 40% through code splitting and lazy loading
• Collaborated with UX/UI designers to create pixel-perfect implementations of Figma designs
• Built reusable component library that reduced development time by 25% across projects
• Integrated RESTful APIs and implemented error handling for seamless user experience
• Participated in code reviews and mentored 2 junior developers

Junior Frontend Developer | WebCraft Agency | Jun 2021 - Dec 2021
• Built responsive websites for 15+ clients using React.js and modern CSS techniques
• Converted PSD/Figma designs to functional web applications with 99% design accuracy
• Implemented interactive features using JavaScript and React hooks
• Optimized websites for SEO and accessibility, achieving 95+ Lighthouse scores
• Collaborated with backend developers to integrate APIs and manage application state
• Maintained and updated existing client websites, fixing bugs and adding new features

PROJECTS

E-Commerce Dashboard | Personal Project
• Built a comprehensive admin dashboard for e-commerce management using Next.js and TypeScript
• Implemented real-time data visualization with Chart.js and responsive tables
• Used Redux Toolkit for state management and integrated with mock REST APIs
• Deployed on Vercel with automated CI/CD pipeline
• Technologies: Next.js, TypeScript, Redux Toolkit, Tailwind CSS, Chart.js

Task Management App | Team Project
• Developed a collaborative task management application similar to Trello
• Implemented drag-and-drop functionality using React DnD library
• Built real-time updates using WebSocket connections
• Created responsive design that works seamlessly on desktop and mobile devices
• Technologies: React.js, Node.js, Socket.io, MongoDB, Express.js

EDUCATION
Bachelor of Science in Computer Science
State University | Graduated May 2021
Relevant Coursework: Data Structures, Algorithms, Web Development, Database Systems

CERTIFICATIONS
• React Developer Certification - Meta (2022)
• JavaScript Algorithms and Data Structures - freeCodeCamp (2021)
• Responsive Web Design - freeCodeCamp (2021)`
  }

  // Interview session state
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isInterviewActive, setIsInterviewActive] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [responses, setResponses] = useState<string[]>([])
  const [currentResponse, setCurrentResponse] = useState('')
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceTranscript, setVoiceTranscript] = useState('')

  // Timer state for 15-minute limit
  const [interviewStartTime, setInterviewStartTime] = useState<Date | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(15 * 60) // 15 minutes in seconds
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchInterviewSessions()
  }, [])

  // Timer effect for 15-minute limit
  useEffect(() => {
    if (isInterviewActive && interviewStartTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - interviewStartTime.getTime()) / 1000)
        const remaining = Math.max(0, 15 * 60 - elapsed)
        setTimeRemaining(remaining)

        if (remaining === 0) {
          endInterview()
          toast.error('Voxa mock interview time limit reached (15 minutes)')
        }
      }, 1000)

      setTimerInterval(interval)
      return () => clearInterval(interval)
    }
  }, [isInterviewActive, interviewStartTime])

  // Voice functionality handlers
  const handleCallStart = useCallback(() => {
    setIsRecording(true)
    if (!interviewStartTime) {
      setInterviewStartTime(new Date())
    }
    toast.success('Voxa mock interview started! The AI interviewer will ask you questions.')
  }, [interviewStartTime])

  const handleCallEnd = useCallback(() => {
    setIsRecording(false)
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
    endInterview()
  }, [timerInterval])

  const handleSpeechStart = useCallback(() => {
    setIsSpeaking(true)
  }, [])

  const handleSpeechEnd = useCallback(() => {
    setIsSpeaking(false)
  }, [])

  const handleMessage = useCallback((message: any) => {
    console.log('Interview Vapi message:', message)
  }, [])

  const handleError = useCallback(async (error: any) => {
    console.error('Interview Vapi error:', error)

    // Handle specific error types
    if (error.message && error.message.includes('ejection')) {
      // Calculate how long the interview ran
      const duration = interviewStartTime
        ? Math.floor((Date.now() - interviewStartTime.getTime()) / 1000)
        : 0

      if (duration >= 9 * 60) { // If interview ran for 9+ minutes, likely hit API time limit
        toast.success('Interview completed! Your session reached the maximum duration allowed by your plan.')
      } else {
        toast.error('Interview session ended unexpectedly. Saving your progress...')
      }

      // Save the incomplete session
      await saveIncompleteSession()

      // End the interview gracefully
      setTimeout(() => {
        if (currentStage === 'interview') {
          endInterview(true) // Pass true to indicate it's an abrupt end
        }
      }, 1000)
    } else {
      toast.error('Voice interview error. Please try again.')
    }

    setIsRecording(false)
  }, [currentStage, interviewData, voiceTranscript, interviewStartTime])

  const handleTranscript = useCallback((transcript: any) => {
    if (transcript.transcript) {
      setVoiceTranscript(transcript.transcript)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isVapiActive()) {
        stopVapiSession()
      }
      cleanupVapiEventHandlers()
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [])

  const fetchInterviewSessions = async () => {
    try {
      const response = await fetch('/api/interview/sessions')
      if (response.ok) {
        const data = await response.json()
        setInterviewSessions(data)
      }
    } catch (error) {
      console.error('Failed to fetch interview sessions:', error)
    } finally {
      setIsLoadingSessions(false)
    }
  }

  // Format time remaining for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Start the voice interview
  const startVoiceInterview = async () => {
    if (!interviewData.jobDescription || !interviewData.resume || !interviewData.role) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoadingQuestions(true)
    try {
      console.log('Starting voice interview with data:', {
        role: interviewData.role,
        jobDescriptionLength: interviewData.jobDescription.length,
        resumeLength: interviewData.resume.length
      })

      // Generate personalized questions based on JD and resume
      const response = await fetch('/api/interview/personalized-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription: interviewData.jobDescription,
          resume: interviewData.resume,
          role: interviewData.role
        }),
      })

      console.log('API Response status:', response.status)
      console.log('API Response ok:', response.ok)

      if (!response.ok) {
        // Get the error details from the API response
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('API Error:', response.status, errorData)
        throw new Error(errorData.error || `API Error: ${response.status}`)
      }

      const data = await response.json()
      setQuestions(data.questions)

      // Setup Vapi event handlers
      setupVapiEventHandlers(
        handleCallStart,
        handleCallEnd,
        handleSpeechStart,
        handleSpeechEnd,
        handleMessage,
        handleError,
        handleTranscript
      )

      // Start voice session with personalized interview context
      await startVapiSession('personalizedInterview')

      setCurrentStage('interview')
      setIsInterviewActive(true)
      setCurrentQuestionIndex(0)
      setResponses([])
      setCurrentResponse('')
      setTimeRemaining(10 * 60) // 10 minutes to match Vapi API limits

    } catch (error) {
      console.error('Interview start error:', error)

      // Provide more specific error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error('Network error: Unable to connect to server. Please check your connection.')
      } else if (error instanceof Error) {
        toast.error(`Failed to start interview: ${error.message}`)
      } else {
        toast.error('Failed to start interview. Please try again.')
      }
    } finally {
      setIsLoadingQuestions(false)
    }
  }

  // Start trial mode with sample data
  const startTrialMode = () => {
    setInterviewData(sampleData)
    setIsTrialMode(true)
    toast.success('Trial mode activated! Sample data loaded - you can start the interview right away.')
  }

  // Reset to normal mode
  const resetToNormalMode = () => {
    setInterviewData({ jobDescription: '', resume: '', role: '' })
    setIsTrialMode(false)
    setCurrentStage('setup')
    setVoiceTranscript('')
    setTimeRemaining(10 * 60) // 10 minutes to match Vapi API limits
  }

  // Save incomplete session when interview ends abruptly
  const saveIncompleteSession = async () => {
    try {
      const duration = interviewStartTime
        ? Math.floor((Date.now() - interviewStartTime.getTime()) / 1000)
        : 0

      const response = await fetch('/api/interview/save-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: interviewData.role,
          jobDescription: interviewData.jobDescription,
          resume: interviewData.resume,
          transcript: voiceTranscript || 'Interview session ended unexpectedly',
          duration,
          status: 'incomplete'
        }),
      })

      if (response.ok) {
        console.log('Incomplete session saved successfully')
        const savedSession = await response.json()
        console.log('Saved session data:', savedSession)
        // Add the saved session to the list immediately
        setInterviewSessions(prev => [savedSession, ...prev])
        // Also refresh from server to ensure consistency
        fetchInterviewSessions()
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Failed to save incomplete session:', response.status, errorData)
      }
    } catch (error) {
      console.error('Error saving incomplete session:', error)
    }
  }

  // End the interview
  const endInterview = async (isAbruptEnd = false) => {
    try {
      if (isVapiActive()) {
        await stopVapiSession()
      }
      cleanupVapiEventHandlers()

      if (timerInterval) {
        clearInterval(timerInterval)
        setTimerInterval(null)
      }

      // Calculate duration
      const duration = interviewStartTime
        ? Math.floor((Date.now() - interviewStartTime.getTime()) / 1000)
        : 0

      // Save interview session - use different endpoints based on whether it's an abrupt end
      if (isAbruptEnd) {
        // For abrupt ends, the session was already saved by saveIncompleteSession
        toast.success('Interview session saved. You can view it in your history below.')
      } else {
        // For normal completion, use the evaluation endpoint
        const response = await fetch('/api/interview/evaluate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            role: interviewData.role,
            jobDescription: interviewData.jobDescription,
            resume: interviewData.resume,
            transcript: voiceTranscript,
            duration
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setInterviewSessions(prev => [data, ...prev])
          toast.success('Voxa mock interview completed! Check your feedback below.')
        } else {
          // If evaluation fails, save as incomplete session
          await fetch('/api/interview/save-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              role: interviewData.role,
              jobDescription: interviewData.jobDescription,
              resume: interviewData.resume,
              transcript: voiceTranscript || 'Interview completed but evaluation failed',
              duration,
              status: 'completed'
            }),
          })
          toast.success('Interview completed and saved!')
        }
      }

      setCurrentStage('completed')
      setIsInterviewActive(false)
      setIsRecording(false)
      setInterviewStartTime(null)

    } catch (error) {
      toast.error('Failed to end interview properly.')
      console.error('Error:', error)
    }
  }

  // These functions are no longer needed in the new voice interview flow
  // The interview is now fully voice-based and managed by Vapi

  // This function is replaced by endInterview() which handles the new voice interview flow

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="space-y-8">
      {/* Interview Setup Form */}
      {currentStage === 'setup' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 p-6 lg:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Setup Your Interview
                </h2>
                <p className="text-sm text-purple-600 font-medium">
                  Personalized AI Practice Session
                </p>
              </div>
            </div>
            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Upload your resume and job description for a tailored 15-minute mock interview.
            </p>
          </div>

          {/* Compact Trial Mode Section */}
          {!isTrialMode && !interviewData.role && !interviewData.jobDescription && !interviewData.resume && (
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200/50 shadow-lg">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Icon and Text */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Just Want to Try Voxa?
                      </h3>
                      <p className="text-sm text-gray-600">
                        No resume handy? Try our sample Frontend Developer profile instantly.
                      </p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={startTrialMode}
                      className="group relative px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl hover:from-orange-600 hover:to-yellow-600 font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-orange-400/20"
                    >
                      <div className="flex items-center gap-2">
                        <span>Try Demo</span>
                        <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                          <span className="text-xs font-bold">FREE</span>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Compact benefits */}
                <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
                  <span>✓ No signup required</span>
                  <span>✓ Instant access</span>
                  <span>✓ Full experience</span>
                </div>
              </div>
            </div>
          )}

          {/* Trial Mode Indicator */}
          {isTrialMode && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Trial Mode Active</h4>
                      <p className="text-sm text-gray-600">Using sample Frontend Developer profile</p>
                    </div>
                  </div>
                  <button
                    onClick={resetToNormalMode}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 underline"
                  >
                    Use my own data instead
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-5xl mx-auto space-y-6">
            {/* Compact Form Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Job Description Section */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-5 border border-blue-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Briefcase className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Job Description</h3>
                    <p className="text-xs text-blue-600 font-medium">Target role details</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Role Title
                    </label>
                    <input
                      type="text"
                      value={interviewData.role}
                      onChange={(e) => setInterviewData(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g., Senior Software Engineer"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-gray-900 placeholder-gray-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Job Description
                    </label>
                    <textarea
                      value={interviewData.jobDescription}
                      onChange={(e) => setInterviewData(prev => ({ ...prev, jobDescription: e.target.value }))}
                      placeholder="Paste the complete job description here..."
                      rows={10}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white shadow-sm text-gray-900 placeholder-gray-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Resume Section */}
              <div className="bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl p-5 border border-green-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Your Resume</h3>
                    <p className="text-xs text-green-600 font-medium">Personal background</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Resume
                  </label>
                  <ResumeUpload
                    value={interviewData.resume}
                    onChange={(content) => setInterviewData(prev => ({ ...prev, resume: content }))}
                  />
                </div>
              </div>
            </div>

            {/* Compact Start Interview Button */}
            <div className="flex justify-center pt-8">
              <div className="text-center max-w-lg">


                <button
                  onClick={startVoiceInterview}
                  disabled={isLoadingQuestions || !interviewData.jobDescription || !interviewData.resume || !interviewData.role}
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white rounded-2xl hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-purple-500/20"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>

                  {isLoadingQuestions ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="text-base">Preparing Your Interview...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors shadow-lg">
                        <Play className="h-4 w-4" />
                      </div>
                      <span className="flex-shrink-0">Start Your Mock Interview</span>
                      <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <span className="text-xs font-bold">15m</span>
                      </div>
                    </div>
                  )}
                </button>

                {/* Compact description */}
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    🎯 Personalized interview based on your job description and resume
                  </p>

                  {/* Compact benefits */}
                  <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Real-time feedback
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      Voice-powered AI
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      Professional analysis
                    </span>
                  </div>

                  <div className="text-xs text-gray-400">
                    ⚡ Optimized 15-minute session for maximum learning impact
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Interview - Video Call Layout */}
      {currentStage === 'interview' && (
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100/50 overflow-hidden">
          {/* Interview Header with Timer */}
          <div className="bg-gradient-to-r from-purple-50 via-white to-blue-50 p-8 border-b border-gray-100/50">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {interviewData.role} Interview
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-lg text-purple-600 font-medium">
                      Voxa Mock Interview in Progress
                    </p>
                    {isTrialMode && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                        Trial Mode
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-1">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Time Remaining</div>
                </div>
                <button
                  onClick={endInterview}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Square className="h-5 w-5" />
                  End Interview
                </button>
              </div>
            </div>

            {/* Timer Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mt-6 shadow-inner">
              <div
                className="bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-1000 shadow-sm"
                style={{ width: `${(timeRemaining / (10 * 60)) * 100}%` }}
              />
            </div>
          </div>

          {/* Video Call Interface */}
          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 mb-10">
              {/* AI Interviewer Side */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl aspect-video relative overflow-hidden shadow-2xl border border-purple-800/50">
                  {/* Video Off Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-xl">
                        <Bot className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-xl mb-3">AI Interviewer</h3>
                      <div className="flex items-center justify-center gap-3 text-white/80 text-base">
                        <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                        <span className="font-medium">{isSpeaking ? 'Speaking...' : 'Listening'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Audio Waveform Animation */}
                  {isSpeaking && (
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-end gap-2 justify-center opacity-70">
                        {[15, 25, 20, 30, 18, 22, 28, 16, 24, 19].map((height, i) => (
                          <div
                            key={i}
                            className="w-1.5 bg-white rounded-full animate-pulse"
                            style={{
                              height: `${height}px`,
                              animationDelay: `${i * 0.1}s`,
                              animationDuration: `${1 + (i % 3) * 0.2}s`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                  <h4 className="font-bold text-gray-900 text-lg">Voxa AI Interviewer</h4>
                  <p className="text-purple-600 font-medium">Powered by Vapi & Claude AI</p>
                </div>
              </div>

              {/* User Side */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl aspect-video relative overflow-hidden shadow-2xl border border-gray-700/50">
                  {/* Video Off Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-xl">
                        <User className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-xl mb-3">You</h3>
                      <div className="flex items-center justify-center gap-3 text-white/80 text-base">
                        <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                        <span className="font-medium">{isRecording ? 'Active' : 'Ready'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recording Indicator */}
                  <div className="absolute top-6 right-6">
                    <div className={`p-3 rounded-xl shadow-lg ${isRecording ? 'bg-green-500' : 'bg-gray-500'}`}>
                      <Mic className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  {/* Recording Animation */}
                  {isRecording && (
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                        <span className="text-green-400 text-sm font-medium">Recording</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <h4 className="font-bold text-gray-900 text-lg">Candidate</h4>
                  <p className="text-gray-600 font-medium">Voice Interview Mode</p>
                </div>
              </div>
            </div>

            {/* Live Transcript */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl p-8 mb-8 border border-gray-200/50 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-xl">Live Conversation</h3>
                  <div className="flex items-center gap-3 text-blue-600 font-medium">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span>Real-time transcript</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[120px] max-h-48 overflow-y-auto">
                {voiceTranscript ? (
                  <div className="text-gray-800 text-base leading-relaxed">
                    {voiceTranscript}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-gray-500 text-sm">Conversation transcript will appear here...</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Interview Status */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200/50 shadow-lg">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-4 text-center lg:text-left">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse" />
                  <span className="font-bold text-gray-900 text-lg">Voxa Mock Interview Active</span>
                </div>
                <span className="hidden lg:block text-gray-400">•</span>
                <span className="text-gray-600 max-w-2xl">
                  The AI interviewer will ask you personalized questions based on your resume and job description.
                  Speak naturally and take your time to provide thoughtful responses.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interview Completed */}
      {currentStage === 'completed' && (
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100/50 p-8 lg:p-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MessageSquare className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
              Interview Completed! 🎉
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Excellent work! Your Voxa mock interview has been completed and saved. You can review your performance
              and detailed feedback in the interview history below.
            </p>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8 border border-green-200/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-1">✓</div>
                  <div className="text-sm font-semibold text-gray-900">Interview Saved</div>
                  <div className="text-xs text-gray-600">Performance recorded</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">📊</div>
                  <div className="text-sm font-semibold text-gray-900">Feedback Generated</div>
                  <div className="text-xs text-gray-600">AI analysis complete</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 mb-1">🚀</div>
                  <div className="text-sm font-semibold text-gray-900">Ready for Next</div>
                  <div className="text-xs text-gray-600">Practice more anytime</div>
                </div>
              </div>
            </div>

            <button
              onClick={resetToNormalMode}
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white rounded-2xl hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Play className="h-4 w-4" />
                </div>
                Start New Mock Interview
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Interview History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Interview History</h2>
            <p className="text-sm text-gray-600">Track your progress and review past performances</p>
          </div>
        </div>

        {isLoadingSessions ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : interviewSessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No interviews yet</h3>
            <p className="text-gray-600 mb-6">Start your first mock interview to see your progress here</p>
            <div className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
              🎯 Ready to practice? Choose a role above!
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {interviewSessions.map((session) => (
              <div key={session.id} className="group border border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-sm transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-gray-900 text-lg">{session.role}</h3>
                        {session.status === 'incomplete' && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                            Incomplete
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(session.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {session.duration && (
                          <span className="ml-2">• {Math.floor(session.duration / 60)}m {session.duration % 60}s</span>
                        )}
                      </p>
                    </div>
                  </div>
                  {session.score && (
                    <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold text-yellow-700">{session.score}/10</span>
                    </div>
                  )}
                </div>

                {session.feedback && (
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">AI Feedback</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{session.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
