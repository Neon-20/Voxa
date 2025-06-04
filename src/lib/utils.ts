import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const productivityMethods = [
  {
    id: 1,
    title: "Pomodoro Technique",
    description: "Work in 25-minute focused intervals followed by 5-minute breaks",
    icon: "🍅",
    steps: [
      "Choose a task to work on",
      "Set a timer for 25 minutes",
      "Work on the task until the timer rings",
      "Take a 5-minute break",
      "After 4 pomodoros, take a longer 15-30 minute break"
    ]
  },
  {
    id: 2,
    title: "Eisenhower Matrix",
    description: "Prioritize tasks based on urgency and importance",
    icon: "📊",
    steps: [
      "List all your tasks",
      "Categorize into: Urgent & Important (Do first)",
      "Important but not urgent (Schedule)",
      "Urgent but not important (Delegate)",
      "Neither urgent nor important (Eliminate)"
    ]
  },
  {
    id: 3,
    title: "Time Blocking",
    description: "Schedule specific time blocks for different activities",
    icon: "📅",
    steps: [
      "Review your tasks and priorities",
      "Estimate time needed for each task",
      "Block out specific times in your calendar",
      "Include buffer time between blocks",
      "Stick to your schedule and adjust as needed"
    ]
  },
  {
    id: 4,
    title: "Getting Things Done (GTD)",
    description: "Capture, clarify, organize, reflect, and engage with your tasks",
    icon: "✅",
    steps: [
      "Capture everything in a trusted system",
      "Clarify what each item means and what action is required",
      "Organize by context and priority",
      "Reflect by reviewing your system regularly",
      "Engage by taking action with confidence"
    ]
  },
  {
    id: 5,
    title: "Eat the Frog",
    description: "Tackle your most challenging task first thing in the morning",
    icon: "🐸",
    steps: [
      "Identify your most important/difficult task",
      "Do it first thing in the morning",
      "Don't check email or social media first",
      "Focus completely on this one task",
      "Celebrate completing your 'frog'"
    ]
  }
]

export const featuredRoadmaps = [
  {
    id: 1,
    role: "Software Engineer",
    description: "Complete roadmap from beginner to senior software engineer",
    estimatedTime: "2-4 years",
    difficulty: "Intermediate"
  },
  {
    id: 2,
    role: "Data Scientist",
    description: "Path to becoming a data scientist with ML expertise",
    estimatedTime: "1-3 years",
    difficulty: "Advanced"
  },
  {
    id: 3,
    role: "Product Manager",
    description: "Journey from associate to senior product manager",
    estimatedTime: "2-5 years",
    difficulty: "Intermediate"
  },
  {
    id: 4,
    role: "UX Designer",
    description: "Complete UX design career progression",
    estimatedTime: "1-3 years",
    difficulty: "Beginner"
  },
  {
    id: 5,
    role: "Digital Marketing Specialist",
    description: "Modern digital marketing career path",
    estimatedTime: "1-2 years",
    difficulty: "Beginner"
  }
]
