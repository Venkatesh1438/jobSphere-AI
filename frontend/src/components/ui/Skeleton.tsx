import React from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle'
}

export default function Skeleton({ className, variant = 'rect', ...props }: SkeletonProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'animate-pulse bg-slate-200/80',
          {
            'h-4 w-full rounded-md': variant === 'text',
            'h-24 w-full rounded-2xl': variant === 'rect',
            'h-12 w-12 rounded-full': variant === 'circle',
          }
        ),
        className
      )}
      {...props}
    />
  )
}
