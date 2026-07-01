import React from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean
  glassmorphism?: boolean
}

export const Card: React.FC<CardProps> = ({ 
  className, 
  hoverEffect = false, 
  glassmorphism = false, 
  children, 
  ...props 
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl border transition-all duration-300 p-6',
          {
            'bg-white border-slate-200 dark:bg-darkCard dark:border-darkBorder': !glassmorphism,
            'backdrop-blur-md bg-white/70 border-white/20 dark:bg-darkCard/70 dark:border-darkBorder/40': glassmorphism,
            'hover:shadow-xl hover:shadow-slate-100 dark:hover:shadow-none hover:-translate-y-0.5': hoverEffect,
          }
        ),
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
