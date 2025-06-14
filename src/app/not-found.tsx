import Link from 'next/link'
import { Mic } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="text-center px-4">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 rounded-2xl shadow-lg flex items-center justify-center relative overflow-hidden">
            {/* Sound wave pattern */}
            <div className="relative flex items-center space-x-0.5">
              <div className="w-0.5 h-3 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-0.5 h-5 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-0.5 h-4 bg-white/90 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
              <div className="w-0.5 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></div>
              <div className="w-0.5 h-3 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
            </div>
          </div>
        </div>

        {/* 404 Message */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Go Home
          </Link>
          <Link
            href="/interview"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Mic className="h-5 w-5 mr-2" />
            Start Interview
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 text-sm text-gray-500">
          <p>Need help? Contact our support team or check our documentation.</p>
        </div>
      </div>
    </div>
  )
}
