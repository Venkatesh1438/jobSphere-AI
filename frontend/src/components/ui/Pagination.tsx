import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

interface PaginationProps {
  currentPage: number
  totalItems: number
  pageSize?: number
  onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize = 20,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      let start = Math.max(1, currentPage - 2)
      let end = Math.min(totalPages, currentPage + 2)

      if (start === 1) {
        end = maxVisible
      } else if (end === totalPages) {
        start = totalPages - maxVisible + 1
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center space-x-2 py-6">
      {/* Prev Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 border-slate-200"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Pages */}
      {pageNumbers[0] > 1 && (
        <>
          <Button
            variant={currentPage === 1 ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onPageChange(1)}
            className={`w-9 h-9 p-0 font-bold ${currentPage !== 1 ? 'border-slate-200' : ''}`}
          >
            1
          </Button>
          {pageNumbers[0] > 2 && <span className="text-slate-400 font-bold px-1">...</span>}
        </>
      )}

      {pageNumbers.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 p-0 font-bold ${currentPage === page ? 'shadow-md shadow-blue-500/10' : 'border-slate-200'}`}
        >
          {page}
        </Button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="text-slate-400 font-bold px-1">...</span>
          )}
          <Button
            variant={currentPage === totalPages ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className={`w-9 h-9 p-0 font-bold ${currentPage !== totalPages ? 'border-slate-200' : ''}`}
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 border-slate-200"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
