import React from 'react'
import { Search, X } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
  value: string
}

export default function SearchInput({ className, onClear, value, ...props }: SearchInputProps) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
        <Search className="h-4.5 w-4.5" />
      </div>
      <input
        type="text"
        value={value}
        className={twMerge(
          'w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all',
          className
        )}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
