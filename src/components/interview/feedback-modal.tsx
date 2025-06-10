'use client'

import { Star, MessageSquare, Calendar, Clock, TrendingUp } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { formatDateForPDF } from '@/lib/pdf-export'

interface InterviewSession {
  id: string
  role: string
  feedback: string | null
  score: number | null
  duration: number | null
  created_at: string
  status?: string
}

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  session: InterviewSession | null
}

export function FeedbackModal({ isOpen, onClose, session }: FeedbackModalProps) {
  if (!session) return null

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent'
    if (score >= 6) return 'Good'
    if (score >= 4) return 'Fair'
    return 'Needs Improvement'
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Interview Feedback"
      size="lg"
      footer={
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Session Info */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-lg">{session.role}</h3>
            {session.status === 'incomplete' && (
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                Incomplete
              </span>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDateForPDF(session.created_at)}</span>
            </div>
            {session.duration && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(session.duration)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Score Section */}
        {session.score && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Performance Score</h4>
            </div>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${getScoreColor(session.score)}`}>
                <Star className="h-5 w-5" />
                <span className="font-bold text-lg">{session.score}/10</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">{getScoreLabel(session.score)}</div>
                <div className="text-sm text-gray-600">Overall Performance</div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            <h4 className="font-semibold text-gray-900">AI Feedback</h4>
          </div>

          {session.feedback ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {session.feedback}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h4 className="font-medium text-gray-900 mb-2">No Feedback Available</h4>
              <p className="text-gray-600 text-sm">
                {session.status === 'incomplete'
                  ? 'This interview was incomplete, so no feedback was generated.'
                  : 'Feedback is not available for this interview session.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
