import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  useRecruiterJobs,
  useCreateJob,
  useUpdateJob,
  useDeleteJob,
  useChangeJobStatus,
  Job
} from '../../api/jobs'
import { useRecruiterCompany } from '../../api/companies'
import { useNotifications } from '../../context/NotificationContext'
import PageHeader from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { toast } from 'react-hot-toast'
import { Search, Plus, Edit2, Trash2, MapPin, DollarSign, Briefcase, Play, X, AlertCircle } from 'lucide-react'

interface JobFormInputs {
  title: string
  description: string
  location: string
  employment_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'OTHER'
  experience_level: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD' | 'EXECUTIVE'
  salary_min: number | ''
  salary_max: number | ''
  application_deadline: string | ''
}

export default function JobManagementPage() {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  
  // State variables
  const [isEditing, setIsEditing] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  
  // Modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // API Hooks
  const { data: jobsRes, isLoading, refetch } = useRecruiterJobs(user?.id)
  const { data: companyRes, isLoading: isCompanyLoading } = useRecruiterCompany(user?.id)
  const company = companyRes?.data || null

  const createJobMutation = useCreateJob()
  const updateJobMutation = useUpdateJob()
  const deleteJobMutation = useDeleteJob()
  const changeStatusMutation = useChangeJobStatus()

  const allJobs = jobsRes?.data || []

  // Filter jobs based on local search query
  const filteredJobs = allJobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination bounds
  const jobsPerPage = 8
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  )

  // Skills tags state for Form
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobFormInputs>({
    defaultValues: {
      employment_type: 'FULL_TIME',
      experience_level: 'MID',
      salary_min: '',
      salary_max: '',
      application_deadline: ''
    }
  })

  const handleCreateClick = () => {
    setEditingJob(null)
    setSkills([])
    reset({
      title: '',
      description: '',
      location: '',
      employment_type: 'FULL_TIME',
      experience_level: 'MID',
      salary_min: '',
      salary_max: '',
      application_deadline: ''
    })
    setIsEditing(true)
  }

  const handleEditClick = (job: Job) => {
    setEditingJob(job)
    setSkills(job.skills_required || [])
    
    // Convert deadline ISO date to YYYY-MM-DD for form date input
    const formattedDeadline = job.application_deadline
      ? new Date(job.application_deadline).toISOString().split('T')[0]
      : ''

    reset({
      title: job.title,
      description: job.description,
      location: job.location,
      employment_type: job.employment_type as any,
      experience_level: job.experience_level as any,
      salary_min: job.salary_min ? Number(job.salary_min) : '',
      salary_max: job.salary_max ? Number(job.salary_max) : '',
      application_deadline: formattedDeadline
    })
    setIsEditing(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return
    setDeleteConfirmId(null)

    toast.promise(
      deleteJobMutation.mutateAsync(deleteConfirmId),
      {
        loading: 'Deleting job posting...',
        success: 'Job posting deleted successfully.',
        error: (err: any) => err.response?.data?.message || 'Failed to delete job posting.'
      }
    )
  }

  const handleToggleStatus = async (job: Job) => {
    // If Draft or Closed -> Publish
    // If Published -> Close
    const targetStatus = job.status === 'PUBLISHED' ? 'CLOSED' : 'PUBLISHED'
    
    try {
      await changeStatusMutation.mutateAsync({ id: job.id, status: targetStatus })
      if (targetStatus === 'PUBLISHED') {
        addNotification('Job Published', `Successfully published "${job.title}"`, 'success')
      } else {
        toast.success('Job vacancy closed successfully.')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || err.response?.data?.message || 'Failed to change job status.')
    }
  }

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault()
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: JobFormInputs) => {
    const payload = {
      ...data,
      salary_min: data.salary_min === '' ? null : data.salary_min,
      salary_max: data.salary_max === '' ? null : data.salary_max,
      application_deadline: data.application_deadline === '' ? null : data.application_deadline,
      skills_required: skills,
      status: editingJob ? editingJob.status : 'DRAFT'
    }

    try {
      if (editingJob) {
        await updateJobMutation.mutateAsync({ id: editingJob.id, data: payload })
        if (payload.status === 'PUBLISHED') {
          addNotification('Job Published', `Successfully updated published job "${payload.title}"`, 'success')
        } else {
          toast.success('Job posting updated successfully!')
        }
      } else {
        await createJobMutation.mutateAsync(payload)
        toast.success('Job posting created successfully!')
      }
      setIsEditing(false)
      refetch()
    } catch (err: any) {
      console.error(err)
      const fieldErrors = err.response?.data
      if (typeof fieldErrors === 'object') {
        Object.entries(fieldErrors).forEach(([key, val]: any) => {
          toast.error(`${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
        })
      } else {
        toast.error('An error occurred while saving the job posting.')
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT': return <Badge variant="gray" styleType="soft">Draft</Badge>
      case 'PUBLISHED': return <Badge variant="success" styleType="soft">Published</Badge>
      case 'CLOSED': return <Badge variant="danger" styleType="soft">Closed</Badge>
      default: return <Badge variant="gray" styleType="soft">{status}</Badge>
    }
  }

  if (isLoading || isCompanyLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-100 animate-pulse rounded w-1/4" />
        <Card className="bg-white border-slate-100 p-8 h-96 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Manage Jobs"
          subtitle="Publish, edit, and audit details for your posted openings."
        />
        {!isEditing && (
          <Button
            variant="primary"
            onClick={handleCreateClick}
            className="font-bold shadow-md shadow-blue-500/10"
            disabled={!company}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Post New Job</span>
          </Button>
        )}
      </div>

      {!isCompanyLoading && !company && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-start space-x-3.5">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold text-amber-900">Missing Company Profile</h4>
            <p className="text-xs text-amber-700 leading-relaxed font-semibold">
              You must set up your company profile before you can post or publish job vacancies. Candidates view company details to learn about your culture and team.
            </p>
            <Link
              to="/recruiter/company"
              className="inline-block text-xs font-extrabold text-blue-600 hover:text-blue-750 pt-2"
            >
              Complete Company Setup &rarr;
            </Link>
          </div>
        </div>
      )}

      {isEditing ? (
        /* Edit / Create Form View */
        <Card className="bg-white border-slate-100 p-8 shadow-sm max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-50">
            <h3 className="text-base font-extrabold text-slate-900">
              {editingJob ? `Edit Job Listing: ${editingJob.title}` : 'Post a New Job Opening'}
            </h3>
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Job Title"
                placeholder="e.g. Senior Fullstack Developer"
                error={errors.title?.message}
                {...register('title', { required: 'Job title is required' })}
              />

              <Input
                label="Location"
                placeholder="e.g. London, UK (or Remote)"
                error={errors.location?.message}
                {...register('location', { required: 'Location is required' })}
              />

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-1">Employment Type</label>
                <select
                  className="w-full h-10 px-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold"
                  {...register('employment_type')}
                >
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-1">Experience Level</label>
                <select
                  className="w-full h-10 px-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold"
                  {...register('experience_level')}
                >
                  <option value="ENTRY">Entry Level</option>
                  <option value="MID">Mid Level</option>
                  <option value="SENIOR">Senior Level</option>
                  <option value="LEAD">Lead</option>
                  <option value="EXECUTIVE">Executive</option>
                </select>
              </div>

              <Input
                label="Minimum Salary (Yearly USD)"
                type="number"
                placeholder="e.g. 80000"
                error={errors.salary_min?.message}
                {...register('salary_min', {
                  min: { value: 0, message: 'Must be positive' }
                })}
              />

              <Input
                label="Maximum Salary (Yearly USD)"
                type="number"
                placeholder="e.g. 120000"
                error={errors.salary_max?.message}
                {...register('salary_max', {
                  min: { value: 0, message: 'Must be positive' }
                })}
              />

              <Input
                label="Application Deadline"
                type="date"
                error={errors.application_deadline?.message}
                {...register('application_deadline')}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Job Description</label>
              <textarea
                placeholder="Detail role tasks, requirements, core projects, and daily duties..."
                rows={8}
                className="w-full rounded-2xl border border-slate-200 p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                {...register('description', { required: 'Job description is required' })}
              />
              {errors.description?.message && (
                <span className="text-xs text-red-500 font-semibold">{errors.description.message}</span>
              )}
            </div>

            {/* Core Skills tagging input */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Skills Required</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g. React, Python, Docker"
                  className="flex-1 h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (newSkill.trim()) {
                        setSkills([...skills, newSkill.trim()])
                        setNewSkill('')
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSkill}
                  className="font-bold border-slate-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Skill
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {skills.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No skills added yet.</span>
                ) : (
                  skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="primary"
                      styleType="soft"
                      className="pl-3 pr-1.5 py-1 text-xs font-bold rounded-lg flex items-center space-x-1 border border-blue-100"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        className="p-0.5 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="font-bold border-slate-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="font-bold px-8"
                isLoading={createJobMutation.isPending || updateJobMutation.isPending}
              >
                Save Listing
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        /* Jobs List View */
        <div className="space-y-6">
          {/* Filters card */}
          <Card className="bg-white border-slate-100 p-4 shadow-sm flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by job title or location..."
                className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200/80 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            </div>
          </Card>

          {paginatedJobs.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto">
                <Briefcase className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-slate-900">No jobs found</h4>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  {searchQuery ? "No matches fit your search criteria." : "You haven't posted any job vacancies yet."}
                </p>
              </div>
              {!searchQuery && (
                <Button variant="primary" size="sm" onClick={handleCreateClick}>
                  Create your first job posting
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedJobs.map((job) => (
                <Card key={job.id} className="bg-white border-slate-100 p-6 hover:shadow-md transition-all duration-205 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Job details */}
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="text-base font-extrabold text-slate-950 truncate leading-tight">
                        {job.title}
                      </h4>
                      {getStatusBadge(job.status)}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-semibold text-slate-550">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="capitalize">{job.employment_type.toLowerCase().replace('_', ' ')}</span>
                      {job.salary_min && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="flex items-center gap-0.5">
                            <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                            {Number(job.salary_min).toLocaleString()}
                            {job.salary_max && ` - ${Number(job.salary_max).toLocaleString()}`}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.skills_required?.slice(0, 4).map((s, i) => (
                        <span key={i} className="inline-block bg-slate-50 text-[9px] font-bold text-slate-500 px-2 py-0.5 rounded border border-slate-100">
                          {s}
                        </span>
                      ))}
                      {(job.skills_required?.length || 0) > 4 && (
                        <span className="text-[9px] font-bold text-slate-400 mt-0.5">
                          +{(job.skills_required?.length || 0) - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Job status/actions */}
                  <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                    {/* Status Toggle triggers */}
                    {job.status !== 'CLOSED' && (
                      <Button
                        variant={job.status === 'PUBLISHED' ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => handleToggleStatus(job)}
                        className="font-bold text-xs"
                      >
                        {job.status === 'PUBLISHED' ? (
                          <>
                            <X className="h-3.5 w-3.5 mr-1" />
                            <span>Close Opening</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5 mr-1" />
                            <span>Publish Job</span>
                          </>
                        )}
                      </Button>
                    )}

                    <button
                      onClick={() => handleEditClick(job)}
                      className="p-2 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors"
                      title="Edit Job"
                      disabled={job.status === 'CLOSED'}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(job.id)}
                      className="p-2 rounded-xl border border-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                      title="Delete Job"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              ))}

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center pt-4">
                  <span className="text-xs font-semibold text-slate-450">
                    Showing {(currentPage - 1) * jobsPerPage + 1} - {Math.min(currentPage * jobsPerPage, filteredJobs.length)} of {filteredJobs.length} listings
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Job Posting"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-655 font-semibold leading-relaxed">
            Are you sure you want to delete this job listing? This action will permanently remove it from the platform and delete any applications submitted by candidates.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirmId(null)}
              className="font-bold border-slate-200"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white border-transparent font-bold"
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
