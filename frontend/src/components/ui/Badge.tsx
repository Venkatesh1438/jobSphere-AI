import { FC, HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'gray'
  styleType?: 'solid' | 'soft' | 'outline'
}

export const Badge: FC<BadgeProps> = ({
  children,
  variant = 'gray',
  styleType = 'soft',
  className,
  ...props
}) => {
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all',
          {
            // Soft variants
            'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30': variant === 'primary' && styleType === 'soft',
            'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30': variant === 'success' && styleType === 'soft',
            'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30': variant === 'warning' && styleType === 'soft',
            'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30': variant === 'danger' && styleType === 'soft',
            'bg-slate-100 text-slate-650 border border-slate-200 dark:bg-darkBg dark:text-slate-300 dark:border-darkBorder': variant === 'gray' && styleType === 'soft',

            // Solid variants
            'bg-blue-600 text-white': variant === 'primary' && styleType === 'solid',
            'bg-emerald-600 text-white': variant === 'success' && styleType === 'solid',
            'bg-amber-500 text-white': variant === 'warning' && styleType === 'solid',
            'bg-rose-600 text-white': variant === 'danger' && styleType === 'solid',
            'bg-slate-700 text-white': variant === 'gray' && styleType === 'solid',

            // Outline variants
            'bg-transparent border border-blue-500 text-blue-500 dark:border-blue-500/50 dark:text-blue-400': variant === 'primary' && styleType === 'outline',
            'bg-transparent border border-emerald-500 text-emerald-500 dark:border-emerald-500/50 dark:text-emerald-400': variant === 'success' && styleType === 'outline',
            'bg-transparent border border-amber-500 text-amber-500 dark:border-amber-500/50 dark:text-amber-400': variant === 'warning' && styleType === 'outline',
            'bg-transparent border border-rose-500 text-rose-500 dark:border-rose-500/50 dark:text-rose-400': variant === 'danger' && styleType === 'outline',
            'bg-transparent border border-slate-200 text-slate-500 dark:border-darkBorder dark:text-slate-400': variant === 'gray' && styleType === 'outline',
          }
        ),
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
