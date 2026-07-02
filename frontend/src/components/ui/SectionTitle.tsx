import React from 'react'
import { Sparkles } from 'lucide-react'

interface SectionTitleProps {
  title: string
  subtitle?: string
  badge?: string
  align?: 'left' | 'center'
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  badge,
  align = 'center',
}) => {
  return (
    <div className={`space-y-4 max-w-3xl ${align === 'center' ? 'text-center mx-auto' : 'text-left'}`}>
      {badge && (
        <div className={`inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full tracking-wide uppercase ${align === 'center' ? 'justify-center' : ''}`}>
          <Sparkles className="h-3.5 w-3.5" />
          <span>{badge}</span>
        </div>
      )}
      
      <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
        {title}
      </h2>
      
      {subtitle && (
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}
