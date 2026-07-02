import { FC, HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | null
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs rounded-xl',
  md: 'h-10 w-10 text-sm rounded-2xl',
  lg: 'h-16 w-16 text-xl rounded-3xl',
  xl: 'h-24 w-24 text-3xl rounded-[32px]',
}

const indicatorSizes = {
  sm: 'h-2 w-2 bottom-0 right-0 border-white border',
  md: 'h-2.5 w-2.5 bottom-0 right-0 border-white border-2',
  lg: 'h-4 w-4 bottom-0 right-0 border-white border-2',
  xl: 'h-5 w-5 bottom-0.5 right-0.5 border-white border-2',
}

const gradients = [
  'from-blue-600 to-indigo-500',
  'from-purple-600 to-pink-500',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-orange-500',
  'from-cyan-500 to-blue-600',
]


// Pure function to deterministically assign a gradient based on string name
const getGradient = (name: string) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % gradients.length
  return gradients[index]
}

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0 || !parts[0]) return '?'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export const Avatar: FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  status = null,
  className,
  ...props
}) => {
  const initials = getInitials(name)
  const gradient = getGradient(name)

  return (
    <div className={twMerge('relative inline-block flex-shrink-0', className)} {...props}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={twMerge('object-cover shadow-sm', sizeClasses[size])}
          onError={(e) => {
            // Fall back to initials on error
            (e.target as HTMLElement).style.display = 'none'
          }}
        />
      ) : null}

      {/* Fallback initials element (visible when image isn't loaded or isn't provided) */}
      {!src ? (
        <div
          className={twMerge(
            'flex items-center justify-center font-black text-white shadow-md select-none bg-gradient-to-tr',
            gradient,
            sizeClasses[size]
          )}
        >
          {initials}
        </div>
      ) : null}

      {/* Status indicator */}
      {status ? (
        <span
          className={twMerge(
            'absolute rounded-full shadow-sm block',
            status === 'online' ? 'bg-green-500' : 'bg-slate-400',
            indicatorSizes[size]
          )}
        />
      ) : null}
    </div>
  )
}
