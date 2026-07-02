import React from 'react'
import { twMerge } from 'tailwind-merge'

interface ContentWrapperProps {
  children: React.ReactNode
  className?: string
  layout?: 'dashboard' | 'public'
}

export default function ContentWrapper({ children, className, layout = 'dashboard' }: ContentWrapperProps) {
  return (
    <div
      className={twMerge(
        'w-full mx-auto px-4 sm:px-6 lg:px-8 py-6',
        layout === 'public' ? 'max-w-7xl' : 'max-w-full',
        className
      )}
    >
      {children}
    </div>
  )
}
