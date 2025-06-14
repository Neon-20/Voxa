import { NextRequest, NextResponse } from 'next/server'
import { evaluateVoiceInterview } from '@/lib/anthropic'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { role, jobDescription, resume, transcript, duration } = await request.json()

    if (!role) {
      return NextResponse.json(
        { error: 'Role is required' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const supabase = createSupabaseServerClient(request)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // TEMPORARY: Use a valid UUID for testing if no auth
    let userId: string
    let userEmail: string

    if (authError || !user) {
      console.log('🔧 EVALUATE: No authenticated user found, will save without user_id')
      userId = '00000000-0000-0000-0000-000000000000' // Valid UUID format for logging
      userEmail = 'test@example.com'
    } else {
      console.log('🔧 EVALUATE: Using authenticated user:', { id: user.id, email: user.email })
      userId = user.id
      userEmail = user.email || 'unknown@example.com'
    }

    // Generate AI feedback based on the voice interview transcript
    let overallFeedback = 'Interview completed successfully.'
    let averageScore = 7 // Default score

    if (transcript && transcript.trim()) {
      // Use AI to evaluate the entire interview conversation
      // Get candidate name from user metadata or email
      const candidateName = user?.user_metadata?.full_name ||
                           user?.user_metadata?.name ||
                           userEmail.split('@')[0] ||
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
    console.log('🔧 EVALUATE: Attempting to save to database:', {
      user_id: userId,
      role,
      transcript_length: transcript?.length || 0,
      feedback_length: overallFeedback?.length || 0,
      score: averageScore,
      duration: duration || null,
      status: 'completed'
    })

    // Use service client for anonymous users to bypass RLS
    const dbClient = user ? supabase : createSupabaseServiceClient()

    // For anonymous users, try to insert without user_id constraint
    let insertData: any
    if (user) {
      // Authenticated user - include user_id
      insertData = {
        user_id: userId,
        role,
        transcript: transcript || 'Voice interview completed',
        feedback: overallFeedback,
        score: averageScore,
        duration: duration || null,
        status: 'completed',
      }
    } else {
      // Anonymous user - exclude user_id to avoid FK constraint
      insertData = {
        role,
        transcript: transcript || 'Voice interview completed',
        feedback: overallFeedback,
        score: averageScore,
        duration: duration || null,
        status: 'completed',
      }
    }

    const { data, error: dbError } = await dbClient
      .from('mock_interviews')
      .insert(insertData)
      .select()
      .single()

    if (dbError) {
      console.error('🔥 EVALUATE: Database error:', dbError)
      console.error('🔥 EVALUATE: Error details:', {
        message: dbError.message,
        details: dbError.details,
        hint: dbError.hint,
        code: dbError.code
      })
      throw new Error('Failed to save interview session')
    }

    console.log('✅ EVALUATE: Successfully saved to database:', data)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Interview evaluation error:', error)
    return NextResponse.json(
      { error: 'Failed to evaluate interview' },
      { status: 500 }
    )
  }
}
