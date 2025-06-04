import OpenAI from 'openai'

// Configure for Azure OpenAI
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
  defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION },
  defaultHeaders: {
    'api-key': process.env.AZURE_OPENAI_API_KEY,
  },
})

export { openai }

// Helper functions for different AI tasks
export const generateResumeImprovement = async (resumeContent: string) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an expert career coach and resume writer. Analyze the provided resume and:
        1. Provide specific, actionable feedback
        2. Generate an improved version of the resume
        3. Highlight key improvements made
        
        Format your response as JSON with the following structure:
        {
          "feedback": "Detailed feedback about the original resume",
          "improvedResume": "The improved resume content",
          "keyImprovements": ["List of key improvements made"]
        }`
      },
      {
        role: "user",
        content: `Please analyze and improve this resume:\n\n${resumeContent}`
      }
    ],
    temperature: 0.7,
  })

  return completion.choices[0].message.content
}

export const generateResumeEnhancement = async (resumeContent: string, voiceInstructions?: string | null) => {
  const systemPrompt = `You are an expert career coach and resume optimization specialist. Analyze the provided resume and create a comprehensive enhancement that includes:

1. Detailed feedback on the original resume
2. A significantly improved version with better formatting, stronger action verbs, and quantified achievements
3. Key improvements made with specific explanations
4. ATS (Applicant Tracking System) compatibility score (1-100)
5. Industry-specific optimizations
6. Skills and keyword recommendations for better searchability

${voiceInstructions ? `\nAdditional user instructions: ${voiceInstructions}` : ''}

Format your response as JSON with the following structure:
{
  "feedback": "Detailed feedback about the original resume with specific areas for improvement",
  "improvedResume": "The enhanced resume content with better formatting, stronger language, and optimized structure",
  "keyImprovements": ["List of specific improvements made"],
  "atsScore": number (1-100),
  "industryOptimizations": ["List of industry-specific improvements"],
  "skillsRecommendations": ["List of relevant skills and keywords to add"]
}`

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: `Please analyze and enhance this resume:\n\n${resumeContent}`
      }
    ],
    temperature: 0.7,
  })

  return completion.choices[0].message.content
}

export const generateInterviewQuestions = async (role: string) => {
  const completion = await openai.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an expert interviewer. Generate 5-7 relevant interview questions for the role: ${role}.
        Include a mix of technical, behavioral, and situational questions appropriate for the role level.
        Format as a JSON array of question objects with "question" and "type" fields.`
      },
      {
        role: "user",
        content: `Generate interview questions for: ${role}`
      }
    ],
    temperature: 0.8,
  })

  return completion.choices[0].message.content
}

export const generatePersonalizedInterviewQuestions = async (
  jobDescription: string,
  resume: string,
  role: string
) => {
  try {
    console.log('Calling OpenAI API for personalized questions...')

    const completion = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4",
      messages: [
        {
          role: "system",
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

IMPORTANT: Return ONLY valid JSON, no additional text or formatting.`
        },
        {
          role: "user",
          content: `Role: ${role}

Job Description:
${jobDescription}

Candidate Resume:
${resume}

Generate personalized interview questions based on this specific job and candidate background.`
        }
      ],
      temperature: 0.7,
    })

    const result = completion.choices[0].message.content
    console.log('OpenAI API call successful, response length:', result?.length)

    return result
  } catch (error) {
    console.error('OpenAI API error:', error)

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid OpenAI API key')
      } else if (error.message.includes('quota')) {
        throw new Error('OpenAI API quota exceeded')
      } else if (error.message.includes('rate limit')) {
        throw new Error('OpenAI API rate limit exceeded')
      }
    }

    throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const evaluateInterviewResponse = async (question: string, response: string, role: string) => {
  const completion = await openai.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an expert interviewer evaluating a candidate's response. Provide:
        1. A score from 1-10
        2. Specific feedback on the response
        3. Suggestions for improvement

        Format as JSON: {"score": number, "feedback": "string", "suggestions": ["array of suggestions"]}`
      },
      {
        role: "user",
        content: `Role: ${role}\nQuestion: ${question}\nCandidate Response: ${response}`
      }
    ],
    temperature: 0.7,
  })

  return completion.choices[0].message.content
}

export const evaluateVoiceInterview = async (
  transcript: string,
  role: string,
  jobDescription?: string,
  resume?: string
) => {
  const completion = await openai.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an expert interview evaluator analyzing a complete voice interview conversation. Based on the transcript, provide a comprehensive evaluation that includes:

1. Overall performance score (1-10)
2. Detailed feedback on communication skills, technical knowledge, and cultural fit
3. Specific strengths demonstrated during the interview
4. Areas for improvement with actionable suggestions
5. Assessment of how well the candidate answered questions
6. Evaluation of their enthusiasm and engagement

Consider factors like:
- Clarity and structure of responses
- Depth of technical knowledge
- Problem-solving approach
- Communication skills
- Confidence and professionalism
- Relevance to the role and company

Format as JSON: {
  "score": number (1-10),
  "feedback": "detailed overall feedback",
  "strengths": ["list of strengths"],
  "improvements": ["list of improvement areas"],
  "recommendation": "brief recommendation"
}`
      },
      {
        role: "user",
        content: `Role: ${role}
${jobDescription ? `\nJob Description: ${jobDescription}` : ''}
${resume ? `\nCandidate Resume: ${resume}` : ''}

Interview Transcript:
${transcript}

Please evaluate this interview performance comprehensively.`
      }
    ],
    temperature: 0.7,
  })

  return completion.choices[0].message.content
}

export const answerCareerQuestion = async (question: string) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an expert career coach. Provide helpful, actionable advice for career-related questions. 
        Be encouraging, practical, and specific in your responses.`
      },
      {
        role: "user",
        content: question
      }
    ],
    temperature: 0.7,
  })

  return completion.choices[0].message.content
}

export const generateCareerRoadmap = async (role: string) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a career development expert. Create a comprehensive career roadmap for the role: ${role}.
        Include:
        1. Skills needed at different levels (entry, mid, senior)
        2. Learning resources and certifications
        3. Timeline and milestones
        4. Practical next steps
        
        Format as structured markdown with clear sections and actionable items.`
      },
      {
        role: "user",
        content: `Create a detailed career roadmap for: ${role}`
      }
    ],
    temperature: 0.7,
  })

  return completion.choices[0].message.content
}

export const generateDailyTip = async () => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `Generate a short, actionable productivity or career tip for students and early professionals. 
        Keep it under 100 words and make it practical and motivating.`
      },
      {
        role: "user",
        content: "Generate today's productivity tip"
      }
    ],
    temperature: 0.8,
  })

  return completion.choices[0].message.content
}
