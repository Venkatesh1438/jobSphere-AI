import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './Button'

interface ErrorStateProps {
  error?: any
  title?: string
  description?: string
  onRetry?: () => void
}

export function getFriendlyErrorMessage(err: any): string {
  if (!err) return 'Something went wrong. Please try again.'
  
  // Axios error mapping
  if (err.response) {
    const status = err.response.status
    if (status === 401) return 'Please sign in to continue.'
    if (status === 403) return "You don't have permission for this action."
    if (status === 404) return "We couldn't find what you're looking for."
    if (status >= 500) return 'Something went wrong. Please try again.'
    
    // Check if there is a custom message sent from backend
    const detail = err.response.data?.detail || err.response.data?.message
    if (detail && typeof detail === 'string') return detail
  }
  
  if (err.message && err.message.includes('Network Error')) {
    return 'Network connection issue. Please check your internet connection and try again.'
  }

  return 'Something went wrong. Please try again.'
}

export default function ErrorState({
  error,
  title = 'An error occurred',
  description,
  onRetry,
}: ErrorStateProps) {
  const message = description || getFriendlyErrorMessage(error)

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50/50 border border-red-100 rounded-3xl max-w-lg mx-auto my-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="p-4 bg-red-100 text-red-650 rounded-2xl mb-4">
        <AlertCircle className="h-10 w-10 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-extrabold text-slate-900 tracking-tight">{title}</h3>
      <p className="mt-2 text-xs font-semibold text-slate-550 max-w-sm leading-relaxed">{message}</p>
      
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-6 font-bold border-slate-200 bg-white hover:bg-slate-50 gap-2"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  )
}
