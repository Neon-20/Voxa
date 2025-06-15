'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50'
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Voxa Logo */}
          <Link href="/" className="group flex items-center space-x-3 transition-all duration-300 hover:scale-105">
            <div className="relative">
              {/* Modern Geometric Logo */}
              <div className="w-11 h-11 bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500 flex items-center justify-center relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Sound wave pattern */}
                <div className="relative flex items-center space-x-0.5">
                  <div className="w-0.5 h-3 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-0.5 h-5 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-0.5 h-4 bg-white/90 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-0.5 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></div>
                  <div className="w-0.5 h-3 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
                </div>

                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/20 to-indigo-600/20 group-hover:from-purple-300/30 group-hover:to-indigo-500/30 transition-all duration-500"></div>
              </div>


            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900 tracking-tight">
                  Voxa
                </span>
              </div>
              <span className="text-xs text-gray-500 font-medium -mt-0.5 tracking-wide">
                AI Mock Interviewer
              </span>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="#features" className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-lg hover:bg-blue-50 group">
              <span className="relative z-10">Features</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </Link>
            <Link href="#demo-video-section" className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-all duration-300 rounded-lg hover:bg-purple-50 group">
              <span className="relative z-10">Demo</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </Link>
            <Link href="#how-it-works" className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-all duration-300 rounded-lg hover:bg-green-50 group">
              <span className="relative z-10">How it Works</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </Link>
            <Link href="#testimonials" className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 transition-all duration-300 rounded-lg hover:bg-orange-50 group">
              <span className="relative z-10">Success Stories</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </Link>
          </nav>

          {/* Enhanced Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/interview">
              <Button
                size="sm"
                className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 font-bold px-8 py-3 rounded-2xl border border-purple-500/20"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-3 w-3" />
                  </div>
                  Start Mock Interview
                </div>
              </Button>
            </Link>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="relative">
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700 transition-transform duration-300" />
              )}
            </div>
          </button>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-lg animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col py-6 px-4 space-y-1">
              <Link
                href="#features"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                Features
              </Link>
              <Link
                href="#demo-video-section"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                Demo
              </Link>
              <Link
                href="#how-it-works"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                How it Works
              </Link>
              <Link
                href="#testimonials"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                Success Stories
              </Link>

              <div className="flex flex-col space-y-3 pt-6 mt-4 border-t border-gray-200/50">
                <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/interview" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    size="sm"
                    className="w-full relative bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 font-bold py-4 rounded-2xl border border-purple-500/20"
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>

                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                        <Sparkles className="h-3 w-3" />
                      </div>
                      Start Mock Interview
                    </div>
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
