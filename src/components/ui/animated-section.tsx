'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, ReactNode } from 'react'
import { fadeInUp, staggerContainer } from '@/lib/animations'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: boolean
  animation?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn'
}

export function AnimatedSection({ 
  children, 
  className = '', 
  delay = 0,
  stagger = false,
  animation = 'fadeInUp'
}: AnimatedSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const animations = {
    fadeInUp: {
      hidden: { opacity: 0, y: 60 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.8, 
          ease: [0.25, 0.46, 0.45, 0.94],
          delay 
        }
      }
    },
    fadeInDown: {
      hidden: { opacity: 0, y: -60 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.8, 
          ease: [0.25, 0.46, 0.45, 0.94],
          delay 
        }
      }
    },
    fadeInLeft: {
      hidden: { opacity: 0, x: -60 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { 
          duration: 0.8, 
          ease: [0.25, 0.46, 0.45, 0.94],
          delay 
        }
      }
    },
    fadeInRight: {
      hidden: { opacity: 0, x: 60 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { 
          duration: 0.8, 
          ease: [0.25, 0.46, 0.45, 0.94],
          delay 
        }
      }
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { 
          duration: 0.6, 
          ease: [0.25, 0.46, 0.45, 0.94],
          delay 
        }
      }
    }
  }

  const containerVariants = stagger ? {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      },
    },
  } : animations[animation]

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedCard({ 
  children, 
  className = '',
  delay = 0 
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.6, 
            ease: [0.25, 0.46, 0.45, 0.94],
            delay 
          }
        }
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedButton({ 
  children, 
  className = '',
  onClick,
  ...props 
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
  [key: string]: any
}) {
  return (
    <motion.button
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={{
        rest: { scale: 1 },
        hover: { 
          scale: 1.05,
          transition: { duration: 0.2, ease: 'easeInOut' }
        },
        tap: { 
          scale: 0.95,
          transition: { duration: 0.1 }
        }
      }}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function StaggeredList({ 
  children, 
  className = '',
  staggerDelay = 0.1 
}: {
  children: ReactNode
  className?: string
  staggerDelay?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.2,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggeredItem({ 
  children, 
  className = '' 
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.6, 
            ease: [0.25, 0.46, 0.45, 0.94] 
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
