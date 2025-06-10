import { AuthForm } from '@/components/auth/auth-form'
import { RouteGuard } from '@/components/auth/route-guard'

export default function AuthPage() {
  return (
    <RouteGuard requireAuth={false}>
      <AuthForm />
    </RouteGuard>
  )
}
