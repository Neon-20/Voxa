'use client'

import { useAuth } from '@/components/providers'
import { Sidebar } from './sidebar'
import { AuthForm } from '@/components/auth/auth-form'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth()

  console.log('Dashboard Layout - User:', user, 'Loading:', loading)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Sidebar />
      <main className="w-full overflow-y-auto">
        <div className="p-6 pt-20">
          {children}
        </div>
      </main>
    </div>
  )
}
