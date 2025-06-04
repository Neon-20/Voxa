'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface LazyLoadProps {
  children: ReactNode
  className?: string
  placeholder?: ReactNode
  threshold?: number
}

export function LazyLoad({ 
  children, 
  className = '', 
  placeholder = null,
  threshold = 0.1 
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, hasLoaded])

  return (
    <div ref={ref} className={className}>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      ) : (
        placeholder || (
          <div className="animate-pulse bg-gray-200 rounded-lg h-32 w-full" />
        )
      )}
    </div>
  )
}

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
}

export function LazyImage({ 
  src, 
  alt, 
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+'
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative overflow-hidden">
      {!isLoaded && (
        <motion.img
          src={placeholder}
          alt=""
          className={`${className} absolute inset-0`}
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      {isVisible && (
        <motion.img
          ref={ref}
          src={src}
          alt={alt}
          className={className}
          onLoad={() => setIsLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </div>
  )
}
