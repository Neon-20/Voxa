import { NextRequest, NextResponse } from 'next/server'
import { generateInterviewQuestions } from '@/lib/anthropic'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { role } = await request.json()

    if (!role) {
      return NextResponse.json(
        { error: 'Role is required' },
        { status: 400 }
      )
    }

    // Get user from Supabase
    const supabase = createSupabaseServerClient(request)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Generate interview questions
    const questionsResult = await generateInterviewQuestions(role)
    
    if (!questionsResult) {
      throw new Error('Failed to generate questions')
    }

    // Parse the JSON response from Anthropic
    const questions = JSON.parse(questionsResult)

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Interview questions error:', error)
    return NextResponse.json(
      { error: 'Failed to generate interview questions' },
      { status: 500 }
    )
  }
}
