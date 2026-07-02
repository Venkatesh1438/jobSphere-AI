import { Link } from 'react-router-dom'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <Card className="w-full max-w-md bg-white border-slate-100 shadow-md p-8 text-center space-y-6">
        <div className="mx-auto bg-red-50 text-red-600 p-3.5 rounded-2xl w-fit">
          <ShieldAlert className="h-8 w-8 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">404</h1>
          <h2 className="text-lg font-bold text-slate-900">Page Not Found</h2>
          <p className="text-xs font-semibold text-slate-500 max-w-xs mx-auto leading-relaxed">
            The page you are looking for does not exist or has been moved to another location.
          </p>
        </div>
        <div className="pt-4">
          <Link to="/" className="w-full">
            <Button variant="primary" className="w-full font-bold gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
