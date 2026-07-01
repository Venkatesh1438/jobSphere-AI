import React from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label ? (
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          type={type}
          className={twMerge(
            clsx(
              'w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 transition-all',
              'bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary-500 focus:border-transparent text-slate-850',
              'dark:bg-darkBg dark:border-darkBorder dark:focus:bg-darkCard dark:focus:ring-primary-400 dark:text-white',
              {
                'border-red-500 focus:ring-red-500': !!error,
              }
            ),
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-550 font-medium">{error}</p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
