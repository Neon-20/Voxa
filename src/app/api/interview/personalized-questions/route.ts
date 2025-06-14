import { NextRequest, NextResponse } from 'next/server'
import { generatePersonalizedInterviewQuestions } from '@/lib/anthropic'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { jobDescription, resume, role } = await request.json()

    if (!jobDescription || !resume || !role) {
      return NextResponse.json(
        { error: 'Job description, resume, and role are required' },
        { status: 400 }
      )
    }

    // Check if Anthropic API is configured
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes('placeholder')) {
      console.error('Anthropic API key is not properly configured')
      return NextResponse.json(
        { error: 'Anthropic API key is not configured. Please check your environment variables.' },
        { status: 500 }
      )
    }

    // Temporarily skip authentication for testing
    // TODO: Re-enable authentication once Supabase is properly configured
    /*
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    */

    console.log('Generating personalized questions for role:', role)

    // Generate personalized interview questions
    const questionsResult = await generatePersonalizedInterviewQuestions(
      jobDescription,
      resume,
      role
    )

    if (!questionsResult) {
      throw new Error('Anthropic returned empty response')
    }

    console.log('Raw Anthropic response:', questionsResult)

    // Parse the JSON response from Anthropic
    let questions
    try {
      questions = JSON.parse(questionsResult)
    } catch (parseError) {
      console.error('Failed to parse Anthropic response as JSON:', parseError)
      console.error('Raw response:', questionsResult)
      throw new Error('Invalid JSON response from Anthropic')
    }

    console.log('Parsed questions:', questions)
    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Personalized interview questions error:', error)

    // Provide more specific error messages
    let errorMessage = 'Failed to generate personalized interview questions'
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Anthropic API key is invalid or missing'
      } else if (error.message.includes('quota')) {
        errorMessage = 'Anthropic API quota exceeded'
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Failed to parse AI response'
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
