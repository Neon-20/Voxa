'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'trial'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  badge?: string
  glow?: boolean
  children: React.ReactNode
}

const variantStyles = {
  primary: {
    base: 'bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white hover:from-purple-700 hover:via-purple-800 hover:to-blue-700',
    glow: 'bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600',
    border: 'border-purple-500/20'
  },
  secondary: {
    base: 'border-2 border-purple-300 bg-white text-purple-700 hover:bg-purple-50',
    glow: 'bg-gradient-to-r from-purple-300 to-blue-300',
    border: 'border-purple-300'
  },
  trial: {
    base: 'bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 text-white hover:from-orange-600 hover:via-yellow-600 hover:to-orange-600',
    glow: 'bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500',
    border: 'border-orange-400/20'
  }
}

const sizeStyles = {
  sm: {
    button: 'px-6 py-3 text-sm rounded-xl',
    icon: 'w-4 h-4',
    iconContainer: 'w-5 h-5',
    badge: 'w-5 h-5 text-xs'
  },
  md: {
    button: 'px-8 py-4 text-base rounded-2xl',
    icon: 'w-5 w-5',
    iconContainer: 'w-6 h-6',
    badge: 'w-6 h-6 text-xs'
  },
  lg: {
    button: 'px-10 py-5 text-lg rounded-2xl',
    icon: 'w-5 w-5',
    iconContainer: 'w-7 h-7',
    badge: 'w-6 h-6 text-xs'
  },
  xl: {
    button: 'px-12 py-6 text-xl rounded-3xl',
    icon: 'w-6 w-6',
    iconContainer: 'w-10 h-10',
    badge: 'w-6 h-6 text-sm'
  }
}

export function PremiumButton({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  badge,
  glow = true,
  className,
  children,
  disabled,
  ...props
}: PremiumButtonProps) {
  const variantStyle = variantStyles[variant]
  const sizeStyle = sizeStyles[size]

  return (
    <button
      className={cn(
        // Base styles
        'group relative font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3',
        // Variant styles
        variantStyle.base,
        variantStyle.border,
        // Size styles
        sizeStyle.button,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {/* Glow effect */}
      {glow && (
        <div 
          className={cn(
            'absolute inset-0 rounded-inherit blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10',
            variantStyle.glow
          )}
        />
      )}

      {/* Left icon */}
      {Icon && iconPosition === 'left' && (
        <div className={cn(
          'bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors shadow-lg',
          sizeStyle.iconContainer
        )}>
          <Icon className={sizeStyle.icon} />
        </div>
      )}

      {/* Content */}
      <span className="flex-1">{children}</span>

      {/* Badge */}
      {badge && (
        <div className={cn(
          'bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors font-bold',
          sizeStyle.badge
        )}>
          <span>{badge}</span>
        </div>
      )}

      {/* Right icon */}
      {Icon && iconPosition === 'right' && (
        <div className={cn(
          'bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors shadow-lg',
          sizeStyle.iconContainer
        )}>
          <Icon className={sizeStyle.icon} />
        </div>
      )}
    </button>
  )
}
