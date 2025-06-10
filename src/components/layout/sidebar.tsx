'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers'
import { toast } from 'react-hot-toast'
import {
  FileText,
  MessageSquare,
  Mic,
  Target,
  Lightbulb,
  Map,
  Home,
  LogOut,
  User,
  Menu
} from 'lucide-react'

const navigation = [
  { name: 'Mock Interview', href: '/interview', icon: MessageSquare, featured: true, color: 'text-purple-500' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      router.push('/')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  return (
    <>
      {/* Hamburger Button - Only visible when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Overlay - Shows when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Collapsible on all screen sizes */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 flex h-full flex-col bg-white border-r border-gray-200 shadow-lg transition-all duration-300",
        isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"
      )}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <Link href="/" className="group flex items-center space-x-3 transition-all duration-300 hover:scale-105">
          <div className="relative">
            {/* Modern Geometric Logo */}
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 rounded-2xl shadow-md group-hover:shadow-lg transition-all duration-300 flex items-center justify-center relative overflow-hidden">
              {/* Sound wave pattern */}
              <div className="relative flex items-center space-x-0.5">
                <div className="w-0.5 h-2.5 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                <div className="w-0.5 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                <div className="w-0.5 h-3 bg-white/90 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                <div className="w-0.5 h-5 bg-white rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></div>
                <div className="w-0.5 h-2.5 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
              </div>
            </div>


          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Voxa
              </span>
            </div>
            <span className="text-xs text-gray-500 font-medium -mt-0.5 tracking-wide">
              Voice AI Coach
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const isFeatured = item.featured
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-600'
                  : isFeatured
                  ? 'text-purple-600 hover:bg-purple-50 hover:text-purple-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive
                    ? 'text-purple-600'
                    : item.color
                )}
              />
              <span className="flex-1">{item.name}</span>
              {isFeatured && !isActive && (
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              )}
            </Link>
          )
        })}
      </nav>



      {/* User section */}
      {user && (
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="ml-3 flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded hover:bg-red-50"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  )
}
