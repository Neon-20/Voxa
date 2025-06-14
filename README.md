# Voxa - Voice AI Mock Interview Practice

Voxa is a specialized voice AI-powered mock interview platform built with Next.js, Supabase, and Vapi AI. It helps students and professionals master their interview skills through realistic AI-powered voice interview practice sessions.

## Features

### 🎯 Core Features

- **Voice Mock Interviews** - Practice real interviews with AI interviewers through natural voice conversations
- **Resume-Based Questions** - Upload your resume to get personalized interview questions based on your experience
- **Role-Specific Practice** - Choose from various job roles and get industry-specific interview questions
- **Real-Time Feedback** - Get instant AI-powered feedback on your responses, tone, and confidence
- **Performance Analytics** - Track your progress with detailed scoring and improvement recommendations
- **15-Minute Sessions** - Focused interview practice sessions with maximum 15-minute duration

### 🔧 Technical Features

- **Authentication** - Secure user authentication with Supabase Auth (Email/Password + OAuth)
- **Database** - PostgreSQL database with Supabase for data persistence
- **AI Integration** - AI for intelligent interview questions and feedback analysis
- **Voice Integration** - Vapi SDK for natural voice-based interview interactions
- **Responsive Design** - Clean, mobile-friendly UI optimized for interview practice
- **Real-time Updates** - Live session updates and progress tracking

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth with OAuth (Google, GitHub)
- **AI**: Anthropic API
- **Voice**: Vapi SDK
- **UI Components**: Radix UI, Lucide React, React Hot Toast
- **Styling**: Tailwind CSS with custom components

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Anthropic API key
- Vapi account (for voice features)

### 1. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Vapi Configuration
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key_here
VAPI_PRIVATE_KEY=your_vapi_private_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Application
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Database Setup

You'll need to set up the following tables in your Supabase database. The SQL schema is provided in the full documentation.

## OAuth Setup

For social authentication (Google and GitHub), you'll need to configure OAuth providers in your Supabase dashboard. See `OAUTH_SETUP.md` for detailed instructions on setting up Google and GitHub OAuth integration.

## Usage

1. **Sign Up/Login** - Create an account or sign in using email/password or social OAuth (Google, GitHub)
2. **Upload Resume** - Upload your resume to get personalized interview questions
3. **Select Role** - Choose the job role you want to practice interviewing for
4. **Start Mock Interview** - Begin your voice-powered interview practice session
5. **Practice Speaking** - Answer AI-generated questions using natural voice
6. **Get Feedback** - Receive detailed analysis and improvement recommendations
7. **Track Progress** - Monitor your performance over time with analytics
