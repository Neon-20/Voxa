import { NextRequest, NextResponse } from 'next/server'
import { evaluateVoiceInterview } from '@/lib/claude'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { role, jobDescription, resume, transcript, duration } = await request.json()

    if (!role) {
      return NextResponse.json(
        { error: 'Role is required' },
        { status: 400 }
      )
    }

    // Get user from Supabase
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Generate AI feedback based on the voice interview transcript
    let overallFeedback = 'Interview completed successfully.'
    let averageScore = 7 // Default score

    if (transcript && transcript.trim()) {
      // Use AI to evaluate the entire interview conversation
      // Get candidate name from user metadata or email
      const candidateName = user.user_metadata?.full_name ||
                           user.user_metadata?.name ||
                           user.email?.split('@')[0] ||
                           'The candidate'

      const evaluationResult = await evaluateVoiceInterview(transcript, role, jobDescription, resume, candidateName)
      if (evaluationResult) {
        try {
          const evaluation = JSON.parse(evaluationResult)
          overallFeedback = evaluation.feedback || overallFeedback
          averageScore = evaluation.score || averageScore
        } catch (parseError) {
          console.error('Failed to parse evaluation result:', parseError)
          overallFeedback = evaluationResult // Use raw text if JSON parsing fails
        }
      }
    }

    // Save to database
    const { data, error: dbError } = await supabase
      .from('mock_interviews')
      .insert({
        user_id: user.id,
        role,
        transcript: transcript || 'Voice interview completed',
        feedback: overallFeedback,
        score: averageScore,
        duration: duration || null,
        status: 'completed',
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to save interview session')
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Interview evaluation error:', error)
    return NextResponse.json(
      { error: 'Failed to evaluate interview' },
      { status: 500 }
    )
  }
}
