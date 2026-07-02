import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useJobDetails } from '../../api/jobs'
import { useApplyJob } from '../../api/applications'
import PageHeader from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { UploadCloud, FileText, ArrowLeft } from 'lucide-react'
import { useNotifications } from '../../context/NotificationContext'

interface ApplyFormInputs {
  cover_letter?: string
  portfolio_url?: string
}

export default function JobApplyPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addNotification } = useNotifications()
  
  const { data: jobRes, isLoading: isJobLoading, isError: isJobError } = useJobDetails(id || '')
  const applyJobMutation = useApplyJob()

  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const job = jobRes?.data

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplyFormInputs>({
    defaultValues: {
      cover_letter: '',
      portfolio_url: '',
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    validateAndSetFile(file)
  }

  const validateAndSetFile = (file: File | undefined) => {
    setFileError(null)
    if (!file) return

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext !== 'pdf' && ext !== 'docx') {
      setFileError('Unsupported file extension. Only PDF and DOCX files are allowed.')
      setResumeFile(null)
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds the 10 MB limit.')
      setResumeFile(null)
      return
    }

    setResumeFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    validateAndSetFile(file)
  }

  const onSubmit = async (data: ApplyFormInputs) => {
    if (!id) return
    if (!resumeFile) {
      setFileError('Please upload your resume to submit your application.')
      return
    }

    const formData = new FormData()
    formData.append('resume', resumeFile)
    if (data.cover_letter) formData.append('cover_letter', data.cover_letter)
    if (data.portfolio_url) formData.append('portfolio_url', data.portfolio_url)

    try {
      await applyJobMutation.mutateAsync({ jobId: id, formData })
      addNotification('Application Submitted', `Successfully applied to "${job?.title || 'Job Opening'}"`, 'success')
      navigate('/candidate/applications')
    } catch (err: any) {
      console.error(err)
      const message = err.response?.data?.detail || err.response?.data?.message || 'Failed to submit application.'
      addNotification('Application Failed', message, 'error')
    }
  }

  if (isJobLoading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-6 space-y-6">
        <div className="h-6 w-32 bg-slate-100 animate-pulse rounded" />
        <Card className="p-8 space-y-4 bg-white border border-slate-100">
          <div className="h-8 bg-slate-100 animate-pulse rounded w-1/2" />
          <div className="h-4 bg-slate-100 animate-pulse rounded w-1/3" />
        </Card>
      </div>
    )
  }

  if (isJobError || !job) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Job posting not found</h2>
        <p className="text-sm text-slate-500">The job listing you are attempting to apply to does not exist or has been removed.</p>
        <Link to="/jobs" className="inline-flex text-sm font-bold text-blue-600 hover:underline">
          Go back to jobs list
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-6 space-y-6">
      {/* Back link */}
      <Link
        to={`/jobs/${job.id}`}
        className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-650 transition-colors"
      >
        <ArrowLeft className="h-4.5 w-4.5 mr-1.5" />
        <span>Back to Job Details</span>
      </Link>

      <PageHeader
        title={`Apply for ${job.title}`}
        subtitle="Provide your credentials and matching developer profile to complete the application."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left main form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-white border-slate-100 p-8 shadow-sm space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Resume File Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Resume File (PDF, DOCX) <span className="text-red-500">*</span>
                </label>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center space-y-3 ${
                    isDragOver ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-350'
                  }`}
                >
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="resume" className="cursor-pointer w-full flex flex-col items-center">
                    {resumeFile ? (
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 max-w-full">
                        <FileText className="h-8 w-8 text-blue-600 flex-shrink-0" />
                        <div className="min-w-0 text-left">
                          <p className="text-xs font-bold truncate max-w-[200px]">{resumeFile.name}</p>
                          <p className="text-[10px] text-blue-500 font-semibold">
                            {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="h-10 w-10 text-slate-400" />
                        <span className="block text-xs font-extrabold text-slate-800 mt-2">
                          Drag and drop or click to upload
                        </span>
                        <span className="block text-[10px] text-slate-400 font-semibold mt-1">
                          PDF or DOCX (Max 10 MB)
                        </span>
                      </>
                    )}
                  </label>
                </div>
                {fileError && (
                  <p className="text-xs text-red-500 font-semibold mt-1">{fileError}</p>
                )}
              </div>

              {/* Cover Letter */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Cover Letter (Optional)
                </label>
                <textarea
                  placeholder="Introduce yourself and explain why you're a great fit for this position..."
                  rows={6}
                  className="w-full rounded-2xl border border-slate-200 p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  {...register('cover_letter')}
                />
              </div>

              {/* Portfolio URL */}
              <div>
                <Input
                  label="Portfolio or Github Link (Optional)"
                  type="url"
                  placeholder="https://github.com/yourusername"
                  error={errors.portfolio_url?.message}
                  {...register('portfolio_url', {
                    pattern: {
                      value: /^https?:\/\/.*$/,
                      message: 'Must be a valid URL starting with http:// or https://'
                    }
                  })}
                />
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full font-bold shadow-md shadow-blue-500/10"
                  isLoading={applyJobMutation.isPending}
                >
                  Submit Application
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right sidebar info */}
        <div>
          <Card className="bg-slate-50 border border-slate-200/50 p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Job Summary</h3>
            
            <div className="space-y-3 pt-2 text-xs text-slate-655 font-semibold">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest">Position</span>
                <span className="text-slate-800 block mt-0.5">{job.title}</span>
              </div>
              
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest">Location</span>
                <span className="text-slate-850 block mt-0.5">{job.location}</span>
              </div>
              
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest">Employment Type</span>
                <span className="text-slate-850 block mt-0.5 capitalize">{job.employment_type.toLowerCase().replace('_', ' ')}</span>
              </div>
            </div>

            {job.skills_required && job.skills_required.length > 0 && (
              <div className="pt-4 border-t border-slate-200/60 space-y-2">
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Matching Core Stack</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.skills_required.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-block bg-white text-[9px] font-bold text-slate-700 px-2 py-1 rounded-lg border border-slate-200/50 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
