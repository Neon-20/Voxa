'use client'

import Link from 'next/link'
import { Twitter, Linkedin, Github, Mail } from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Demo', href: '#demo-video-section' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Interview Practice', href: '/interview' }
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' }
  ],
  resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'Help Center', href: '/help' },
    { name: 'Community', href: '/community' },
    { name: 'Support', href: '/support' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR', href: '/gdpr' }
  ]
}

const socialLinks = [
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'GitHub', href: '#', icon: Github },
  { name: 'Email', href: 'mailto:hello@voxa.ai', icon: Mail }
]

export function LandingFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link href="/" className="group flex items-center space-x-3 mb-4 transition-all duration-300 hover:scale-105">
              <div className="relative">
                {/* Modern Geometric Logo */}
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500 flex items-center justify-center relative overflow-hidden">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Sound wave pattern */}
                  <div className="relative flex items-center space-x-0.5">
                    <div className="w-0.5 h-2.5 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-0.5 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-0.5 h-3 bg-white/90 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                    <div className="w-0.5 h-5 bg-white rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></div>
                    <div className="w-0.5 h-2.5 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
                  </div>

                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/20 to-indigo-600/20 group-hover:from-purple-300/30 group-hover:to-indigo-500/30 transition-all duration-500"></div>
                </div>


              </div>

              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-white tracking-tight">
                    Voxa
                  </span>
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
                <span className="text-xs text-gray-400 font-medium -mt-0.5 tracking-wide">
                   AI Interview Coach
                </span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Your voice AI-powered mock interview platform helping students and professionals
              master their interview skills with realistic practice sessions.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Voxa. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Made with ❤️ for job seekers</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-400 text-sm">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
