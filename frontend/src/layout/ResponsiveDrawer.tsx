import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface ResponsiveDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function ResponsiveDrawer({ isOpen, onClose, children }: ResponsiveDrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-55 lg:hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Drawer content sliding from the left */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-y-0 left-0 w-64 bg-white dark:bg-darkCard shadow-2xl h-full flex flex-col z-10"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
