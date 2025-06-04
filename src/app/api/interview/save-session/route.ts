import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { 
      role, 
      jobDescription, 
      resume, 
      transcript, 
      duration, 
      status = 'completed',
      feedback = null,
      score = null 
    } = await request.json()

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

    // Create a basic transcript if none provided
    const finalTranscript = transcript || `Interview for ${role} position - Session ended unexpectedly`

    // Save interview session to database
    const { data, error: dbError } = await supabase
      .from('mock_interviews')
      .insert({
        user_id: user.id,
        role,
        transcript: finalTranscript,
        feedback: feedback || (status === 'incomplete' ? 'Interview session ended unexpectedly. Please try again for a complete session.' : null),
        score: score,
        duration: duration || 0,
        status: status, // Add status field to track complete vs incomplete sessions
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error saving session:', dbError)
      console.error('Attempted to insert:', {
        user_id: user.id,
        role,
        transcript: finalTranscript,
        feedback: feedback || (status === 'incomplete' ? 'Interview session ended unexpectedly. Please try again for a complete session.' : null),
        score: score,
        duration: duration || 0,
        status: status,
      })
      throw new Error('Failed to save interview session')
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Interview session save error:', error)
    return NextResponse.json(
      { error: 'Failed to save interview session' },
      { status: 500 }
    )
  }
}
