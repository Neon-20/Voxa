import { AuthForm } from '@/components/auth/auth-form'
import { RouteGuard } from '@/components/auth/route-guard'
import { Suspense } from 'react'

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <RouteGuard requireAuth={false}>
        <AuthForm />
      </RouteGuard>
    </Suspense>
  )
}
