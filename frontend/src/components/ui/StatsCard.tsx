import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Card } from './Card'

interface StatsCardProps {
  value: React.ReactNode
  label: string
  icon?: LucideIcon
  description?: string
  trend?: {
    value: string
    isPositive?: boolean
  }
}

export const StatsCard: React.FC<StatsCardProps> = ({
  value,
  label,
  icon: Icon,
  description,
  trend,
}) => {
  return (
    <Card hoverEffect={true} className="relative overflow-hidden bg-white border border-slate-100 p-6 flex flex-col justify-between group">
      {/* Decorative gradient background glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors duration-300" />
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</span>
          {Icon && (
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
        
        <div className="flex items-baseline space-x-2">
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {value}
          </h3>
          {trend && (
            <span className={`text-xs font-bold ${trend.isPositive ? 'text-green-600' : 'text-slate-400'}`}>
              {trend.value}
            </span>
          )}
        </div>
      </div>
      
      {description && (
        <p className="mt-2.5 text-xs text-slate-500 font-medium leading-relaxed">
          {description}
        </p>
      )}
    </Card>
  )
}
