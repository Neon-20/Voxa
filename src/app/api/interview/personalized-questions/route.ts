import { NextRequest, NextResponse } from 'next/server'
import { generatePersonalizedInterviewQuestions } from '@/lib/anthropic'
import { createSupabaseServerClient } from '@/lib/supabase'

// Fallback questions for when Anthropic API is unavailable
const getFallbackQuestions = (role: string) => {
  const baseQuestions = [
    {
      question: "Can you tell me about yourself and why you're interested in this role?",
      type: "behavioral"
    },
    {
      question: "What are your greatest strengths and how do they relate to this position?",
      type: "behavioral"
    },
    {
      question: "Describe a challenging project you've worked on and how you overcame obstacles.",
      type: "situational"
    },
    {
      question: "Where do you see yourself in 5 years and how does this role fit into your career goals?",
      type: "behavioral"
    },
    {
      question: "What interests you most about working at our company?",
      type: "behavioral"
    }
  ]

  // Add role-specific questions
  const roleSpecificQuestions = {
    'Frontend Developer': [
      {
        question: "Walk me through your approach to debugging a complex technical issue.",
        type: "technical"
      },
      {
        question: "How do you stay updated with new technologies and programming languages?",
        type: "technical"
      }
    ],
    'Product Manager': [
      {
        question: "How do you prioritize features when you have limited resources?",
        type: "role-specific"
      },
      {
        question: "Describe how you would gather and analyze user feedback for a product.",
        type: "role-specific"
      }
    ],
    'Data Scientist': [
      {
        question: "Explain a machine learning project you've worked on from start to finish.",
        type: "technical"
      },
      {
        question: "How do you handle missing or inconsistent data in your analysis?",
        type: "technical"
      }
    ]
  }

  const specificQuestions = roleSpecificQuestions[role as keyof typeof roleSpecificQuestions] || [
    {
      question: "What specific skills and experience make you a good fit for this role?",
      type: "role-specific"
    },
    {
      question: "How do you handle working under pressure and tight deadlines?",
      type: "situational"
    }
  ]

  return [...baseQuestions, ...specificQuestions]
}

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

    let questions
    try {
      // Generate personalized interview questions (retry logic is handled in the library function)
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
      try {
        questions = JSON.parse(questionsResult)
      } catch (parseError) {
        console.error('Failed to parse Anthropic response as JSON:', parseError)
        console.error('Raw response:', questionsResult)
        throw new Error('Invalid JSON response from Anthropic')
      }

      console.log('Parsed questions:', questions)
    } catch (error) {
      console.warn('Anthropic API failed, using fallback questions:', error instanceof Error ? error.message : 'Unknown error')

      // Use fallback questions when Anthropic API fails
      questions = getFallbackQuestions(role)
      console.log('Using fallback questions for role:', role)
    }

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
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Anthropic API rate limit exceeded. Please try again in a few minutes.'
      } else if (error.message.includes('overloaded')) {
        errorMessage = 'Anthropic API is currently experiencing high traffic. Please try again in a few moments.'
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
