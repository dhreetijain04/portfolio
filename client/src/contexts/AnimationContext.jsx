import React, { createContext, useContext, useState, useEffect } from 'react'

const AnimationContext = createContext()

export const useAnimation = () => {
  const context = useContext(AnimationContext)
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider')
  }
  return context
}

export const AnimationProvider = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)

  useEffect(() => {
    // Check user's motion preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleChange = (e) => {
      setReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    // Check localStorage for animation preference
    const savedPreference = localStorage.getItem('animationsEnabled')
    if (savedPreference !== null) {
      setAnimationsEnabled(JSON.parse(savedPreference))
    }
  }, [])

  const toggleAnimations = () => {
    const newValue = !animationsEnabled
    setAnimationsEnabled(newValue)
    localStorage.setItem('animationsEnabled', JSON.stringify(newValue))
  }

  // Animation configurations based on user preferences
  const getAnimationConfig = (baseConfig = {}) => {
    if (reducedMotion || !animationsEnabled) {
      return {
        ...baseConfig,
        initial: false,
        animate: false,
        exit: false,
        transition: { duration: 0 }
      }
    }
    return baseConfig
  }

  const value = {
    reducedMotion,
    animationsEnabled,
    toggleAnimations,
    getAnimationConfig,
    // Predefined animation variants
    animations: {
      fadeIn: getAnimationConfig({
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.6 }
      }),
      slideUp: getAnimationConfig({
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -30 },
        transition: { duration: 0.6, ease: 'easeOut' }
      }),
      slideDown: getAnimationConfig({
        initial: { opacity: 0, y: -30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 30 },
        transition: { duration: 0.6, ease: 'easeOut' }
      }),
      slideLeft: getAnimationConfig({
        initial: { opacity: 0, x: 30 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -30 },
        transition: { duration: 0.6, ease: 'easeOut' }
      }),
      slideRight: getAnimationConfig({
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 30 },
        transition: { duration: 0.6, ease: 'easeOut' }
      }),
      scale: getAnimationConfig({
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
        transition: { duration: 0.6, ease: 'easeOut' }
      }),
      bounce: getAnimationConfig({
        initial: { opacity: 0, scale: 0.3 },
        animate: { 
          opacity: 1, 
          scale: 1,
          transition: { 
            type: 'spring',
            stiffness: 400,
            damping: 10
          }
        },
        exit: { opacity: 0, scale: 0.3 }
      }),
      stagger: {
        container: getAnimationConfig({
          animate: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }),
        item: getAnimationConfig({
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 }
        })
      }
    }
  }

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  )
}