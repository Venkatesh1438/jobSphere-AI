import { Inbox, LucideIcon } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: LucideIcon
  actionLabel?: string
  onActionClick?: () => void
}

export default function EmptyState({
  title = 'No data found',
  description = 'There is currently nothing to display here.',
  icon: Icon = Inbox,
  actionLabel,
  onActionClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-sm max-w-lg mx-auto mt-6">
      <div className="p-4 bg-primary-50 rounded-2xl text-primary-500 mb-4">
        <Icon className="h-10 w-10 stroke-[1.5]" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 max-w-sm leading-relaxed">{description}</p>
      {actionLabel && onActionClick && (
        <Button
          variant="primary"
          size="sm"
          onClick={onActionClick}
          className="mt-6 shadow-md"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
