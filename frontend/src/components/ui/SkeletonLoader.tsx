import React from 'react'
import Skeleton from './Skeleton'
import { Card } from './Card'

interface SkeletonLoaderProps {
  type: 'job-card' | 'company-card' | 'detail-page' | 'list-page'
  count?: number
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type,
  count = 3,
}) => {
  const renderJobCard = (key: number) => (
    <Card key={key} className="border-slate-200 bg-white p-6 space-y-4 animate-pulse">
      <div className="flex gap-4">
        <Skeleton className="h-12 w-12 rounded-2xl flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-1/3 rounded-md" />
          <Skeleton className="h-4 w-1/4 rounded-md" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-full rounded-md" />
        <Skeleton className="h-3.5 w-2/3 rounded-md" />
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-md" />
        <Skeleton className="h-6 w-20 rounded-md" />
        <Skeleton className="h-6 w-14 rounded-md" />
      </div>
    </Card>
  )

  const renderCompanyCard = (key: number) => (
    <Card key={key} className="border-slate-200 bg-white p-6 flex flex-col justify-between h-72 animate-pulse">
      <div>
        <div className="flex gap-3 items-center mb-4">
          <Skeleton className="h-12 w-12 rounded-2xl flex-shrink-0" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4.5 w-2/3 rounded-md" />
            <Skeleton className="h-3 w-1/3 rounded-md" />
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-4/5 rounded-md" />
        </div>
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-1/2 rounded-md" />
          <Skeleton className="h-4 w-1/3 rounded-md" />
        </div>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-4 w-20 rounded-md" />
      </div>
    </Card>
  )

  const renderDetailPage = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-white border-slate-200 p-8 space-y-6">
          <div className="flex gap-6 items-center">
            <Skeleton className="h-20 w-20 rounded-3xl flex-shrink-0" />
            <div className="space-y-2.5 flex-1">
              <Skeleton className="h-8 w-1/2 rounded-md" />
              <Skeleton className="h-4.5 w-1/4 rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>
          </div>
          <div className="border-y border-slate-100 py-6 space-y-3">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4 rounded-md" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="bg-white border-slate-200 p-6 space-y-4">
          <Skeleton className="h-6 w-1/2 rounded-md" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-4 w-2/3 rounded-md" />
        </Card>
      </div>
    </div>
  )

  const items = Array.from({ length: count }, (_, i) => i)

  switch (type) {
    case 'job-card':
      return <div className="space-y-4">{items.map((i) => renderJobCard(i))}</div>
    case 'company-card':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((i) => renderCompanyCard(i))}
        </div>
      )
    case 'detail-page':
      return renderDetailPage()
    case 'list-page':
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 hidden lg:block">
            <Card className="bg-white border-slate-200 p-6 space-y-6">
              <Skeleton className="h-6 w-1/2 rounded-md" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-full rounded-lg" />
                <Skeleton className="h-8 w-full rounded-lg" />
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {items.map((i) => renderJobCard(i))}
          </div>
        </div>
      )
    default:
      return null
  }
}
