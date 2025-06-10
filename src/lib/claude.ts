import Anthropic from '@anthropic-ai/sdk'

// Configure Claude client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export { anthropic }

// Helper functions for different AI tasks
export const generateInterviewQuestions = async (role: string) => {
  try {
    console.log('Calling Claude API for interview questions...')
    
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `You are an expert interviewer. Generate 5-7 relevant interview questions for the role: ${role}. 
          Include a mix of technical, behavioral, and situational questions appropriate for the role level.
          Format as a JSON array of question objects with "question" and "type" fields.
          
          IMPORTANT: Return ONLY valid JSON, no additional text or formatting.`
        }
      ],
      temperature: 0.7,
    })

    const result = response.content[0].type === 'text' ? response.content[0].text : ''
    console.log('Claude API call successful, response length:', result?.length)
    
    return result
  } catch (error) {
    console.error('Claude API error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid Claude API key')
      } else if (error.message.includes('quota')) {
        throw new Error('Claude API quota exceeded')
      } else if (error.message.includes('rate limit')) {
        throw new Error('Claude API rate limit exceeded')
      }
    }
    
    throw new Error(`Claude API error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const generatePersonalizedInterviewQuestions = async (
  jobDescription: string, 
  resume: string, 
  role: string
) => {
  try {
    console.log('Calling Claude API for personalized questions...')
    
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: `You are an expert interviewer conducting a personalized interview. Based on the provided job description and candidate's resume, generate 6-8 highly relevant interview questions that:

1. Test specific skills mentioned in the job description
2. Explore the candidate's experience from their resume
3. Include behavioral questions relevant to the role
4. Ask about gaps or transitions in their background
5. Focus on role-specific technical or domain knowledge
6. Include situational questions based on job requirements

Make the questions feel natural and conversational, as if a real interviewer who has studied both documents is asking them.

Format as a JSON array of question objects with "question" and "type" fields.
Types should be: "technical", "behavioral", "situational", "experience-based", or "role-specific".

Keep questions concise but specific to this candidate and role.

IMPORTANT: Return ONLY valid JSON, no additional text or formatting.

Role: ${role}

Job Description:
${jobDescription}

Candidate Resume:
${resume}

Generate personalized interview questions based on this specific job and candidate background.`
        }
      ],
      temperature: 0.7,
    })

    const result = response.content[0].type === 'text' ? response.content[0].text : ''
    console.log('Claude API call successful, response length:', result?.length)
    
    return result
  } catch (error) {
    console.error('Claude API error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid Claude API key')
      } else if (error.message.includes('quota')) {
        throw new Error('Claude API quota exceeded')
      } else if (error.message.includes('rate limit')) {
        throw new Error('Claude API rate limit exceeded')
      }
    }
    
    throw new Error(`Claude API error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const evaluateInterviewResponse = async (question: string, response: string, role: string) => {
  try {
    const claudeResponse = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `You are an expert interviewer evaluating a candidate's response. Provide:
          1. A score from 1-10
          2. Specific feedback on the response
          3. Suggestions for improvement
          
          Format as JSON: {"score": number, "feedback": "string", "suggestions": ["array of suggestions"]}
          
          Role: ${role}
          Question: ${question}
          Candidate Response: ${response}
          
          IMPORTANT: Return ONLY valid JSON, no additional text or formatting.`
        }
      ],
      temperature: 0.7,
    })

    return claudeResponse.content[0].type === 'text' ? claudeResponse.content[0].text : ''
  } catch (error) {
    console.error('Claude API error:', error)
    throw new Error(`Claude API error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const evaluateVoiceInterview = async (
  transcript: string,
  role: string,
  jobDescription?: string,
  resume?: string,
  candidateName?: string
) => {
  try {
    const claudeResponse = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2500,
      messages: [
        {
          role: 'user',
          content: `You are an expert interview evaluator analyzing a complete voice interview conversation. Based on the transcript, provide a comprehensive evaluation that includes:

1. Overall performance score (1-10)
2. Detailed feedback on communication skills, technical knowledge, and cultural fit
3. Specific strengths demonstrated during the interview
4. Areas for improvement with actionable suggestions
5. Assessment of how well the candidate answered questions
6. Evaluation of their enthusiasm and engagement

IMPORTANT GUIDELINES:
- Use the candidate's actual name: ${candidateName || 'The candidate'}
- Use gender-neutral pronouns (they/them) throughout the feedback
- Be specific and professional in your evaluation
- Focus on technical competency and interview performance

Consider factors like:
- Clarity and structure of responses
- Depth of technical knowledge
- Problem-solving approach
- Communication skills
- Confidence and professionalism
- Relevance to the role and company

Format as JSON: {
  "score": number (1-10),
  "feedback": "detailed overall feedback using candidate's name and they/them pronouns",
  "strengths": ["list of strengths"],
  "improvements": ["list of improvement areas"],
  "recommendation": "brief recommendation"
}

Role: ${role}
${jobDescription ? `\nJob Description: ${jobDescription}` : ''}
${resume ? `\nCandidate Resume: ${resume}` : ''}
${candidateName ? `\nCandidate Name: ${candidateName}` : ''}

Interview Transcript:
${transcript}

Please evaluate this interview performance comprehensively using the candidate's name and gender-neutral language.

IMPORTANT: Return ONLY valid JSON, no additional text or formatting.`
        }
      ],
      temperature: 0.7,
    })

    return claudeResponse.content[0].type === 'text' ? claudeResponse.content[0].text : ''
  } catch (error) {
    console.error('Claude API error:', error)
    throw new Error(`Claude API error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
