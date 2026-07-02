import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface LoaderProps {
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  label?: string
  color?: 'primary' | 'white' | 'slate'
}

export default function Loader({ className, size = 'md', label, color = 'primary' }: LoaderProps) {
  const sizeClasses = {
    xs: 'h-4 w-4 stroke-[3]',
    sm: 'h-6 w-6 stroke-[2.5]',
    md: 'h-10 w-10 stroke-[2]',
    lg: 'h-14 w-14 stroke-[2]',
    xl: 'h-20 w-20 stroke-[1.5]',
  }

  const colorClasses = {
    primary: 'text-primary-600',
    white: 'text-white',
    slate: 'text-slate-500',
  }

  return (
    <div className={twMerge('flex flex-col items-center justify-center space-y-3', className)}>
      <svg
        className={clsx('animate-spin', sizeClasses[size], colorClasses[color])}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label && (
        <span className="text-sm font-medium text-slate-500 animate-pulse">
          {label}
        </span>
      )}
    </div>
  )
}
