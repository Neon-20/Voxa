import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase'

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

    // Get authenticated user
    const supabase = createSupabaseServerClient(request)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // TEMPORARY: Use a valid UUID for testing if no auth
    let userId: string

    if (authError || !user) {
      console.log('🔧 SAVE-SESSION: No authenticated user found, will save without user_id')
      userId = '00000000-0000-0000-0000-000000000000' // Valid UUID format for logging
    } else {
      console.log('🔧 SAVE-SESSION: Using authenticated user:', { id: user.id, email: user.email })
      userId = user.id
    }

    // Create a basic transcript if none provided
    const finalTranscript = transcript || `Interview for ${role} position - Session ended unexpectedly`

    // Save interview session to database
    let insertData: any
    if (user) {
      // Authenticated user - include user_id
      insertData = {
        user_id: userId,
        role,
        transcript: finalTranscript,
        feedback: feedback || (status === 'incomplete' ? 'Interview session ended unexpectedly. Please try again for a complete session.' : null),
        score: score,
        duration: duration || 0,
        status: status, // Add status field to track complete vs incomplete sessions
      }
    } else {
      // Anonymous user - exclude user_id to avoid FK constraint
      insertData = {
        role,
        transcript: finalTranscript,
        feedback: feedback || (status === 'incomplete' ? 'Interview session ended unexpectedly. Please try again for a complete session.' : null),
        score: score,
        duration: duration || 0,
        status: status, // Add status field to track complete vs incomplete sessions
      }
    }

    console.log('🔧 SAVE-SESSION: Attempting to save to database:', {
      ...insertData,
      transcript_length: insertData.transcript?.length || 0,
      feedback_length: insertData.feedback?.length || 0
    })

    // Use service client for anonymous users to bypass RLS
    const dbClient = user ? supabase : createSupabaseServiceClient()

    const { data, error: dbError } = await dbClient
      .from('mock_interviews')
      .insert(insertData)
      .select()
      .single()

    if (dbError) {
      console.error('🔥 SAVE-SESSION: Database error:', dbError)
      console.error('🔥 SAVE-SESSION: Error details:', {
        message: dbError.message,
        details: dbError.details,
        hint: dbError.hint,
        code: dbError.code
      })
      console.error('🔥 SAVE-SESSION: Attempted to insert:', insertData)
      throw new Error('Failed to save interview session')
    }

    console.log('✅ SAVE-SESSION: Successfully saved to database:', data)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Interview session save error:', error)
    return NextResponse.json(
      { error: 'Failed to save interview session' },
      { status: 500 }
    )
  }
}
