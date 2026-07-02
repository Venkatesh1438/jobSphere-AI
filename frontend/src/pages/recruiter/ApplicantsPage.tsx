import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useRecruiterJobs } from '../../api/jobs'
import { useJobApplications, useUpdateApplicationStatus, Application } from '../../api/applications'
import PageHeader from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { toast } from 'react-hot-toast'
import ErrorState from '../../components/ui/ErrorState'
import { Users, FileText, Calendar, Mail, Phone, Edit3, ClipboardList, Download } from 'lucide-react'

export default function ApplicantsPage() {
  const { user } = useAuth()
  
  // State variables
  const [selectedJobId, setSelectedJobId] = useState<string>('')
  const [editingApplication, setEditingApplication] = useState<Application | null>(null)
  
  // Status update form states
  const [statusVal, setStatusVal] = useState<string>('')
  const [notesVal, setNotesVal] = useState<string>('')

  // API hooks
  const { data: jobsRes, isLoading: isJobsLoading } = useRecruiterJobs(user?.id)
  const jobs = jobsRes?.data || []

  // Fetch applications if a job is selected
  const { data: appsRes, isLoading: isAppsLoading, isError: isAppsError, error: appsError, refetch } = useJobApplications(selectedJobId)
  const applications = appsRes?.data || []

  const updateStatusMutation = useUpdateApplicationStatus()

  const handleUpdateClick = (app: Application) => {
    setEditingApplication(app)
    setStatusVal(app.status)
    setNotesVal(app.recruiter_notes || '')
  }

  const handleSaveStatus = async () => {
    if (!editingApplication) return
    const appId = editingApplication.id
    setEditingApplication(null)

    toast.promise(
      updateStatusMutation.mutateAsync({
        id: appId,
        status: statusVal,
        recruiter_notes: notesVal
      }).then(() => {
        refetch()
      }),
      {
        loading: 'Updating candidate status...',
        success: 'Candidate status updated successfully.',
        error: (err: any) => err.response?.data?.message || 'Failed to update status.'
      }
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPLIED': return <Badge variant="primary" styleType="soft">New</Badge>
      case 'REVIEWED': return <Badge variant="warning" styleType="soft">Reviewed</Badge>
      case 'SHORTLISTED': return <Badge variant="primary" styleType="soft">Shortlisted</Badge>
      case 'INTERVIEW': return <Badge variant="success" styleType="solid">Interview</Badge>
      case 'REJECTED': return <Badge variant="danger" styleType="soft">Rejected</Badge>
      case 'HIRED': return <Badge variant="success" styleType="solid">Hired</Badge>
      default: return <Badge variant="gray" styleType="soft">{status}</Badge>
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getMatchScoreVariant = (score: number | null) => {
    if (score === null || score === undefined) return 'gray'
    if (score >= 80) return 'success'
    if (score >= 50) return 'primary'
    return 'warning'
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Applicants"
        subtitle="Review resumes, inspect matching skills, and schedule interview status changes."
      />

      {/* Select Job card */}
      <Card className="bg-white border-slate-100 p-6 shadow-sm space-y-4">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
          Filter by Job Posting
        </label>
        
        {isJobsLoading ? (
          <div className="h-10 bg-slate-50 animate-pulse rounded-xl" />
        ) : jobs.length === 0 ? (
          <p className="text-xs text-slate-400 font-semibold italic">You must create a job listing first.</p>
        ) : (
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full max-w-md h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold"
          >
            <option value="">-- Select a job posting --</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} ({job.location})
              </option>
            ))}
          </select>
        )}
      </Card>

      {/* Error state for applications */}
      {selectedJobId && isAppsError && (
        <ErrorState error={appsError} onRetry={refetch} title="Failed to retrieve applicant pipeline" />
      )}

      {/* Loading state for applications */}
      {selectedJobId && isAppsLoading && !isAppsError && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="bg-white border-slate-100 p-8 h-48 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {selectedJobId && !isAppsLoading && !isAppsError && applications.length === 0 && (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto">
            <Users className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-extrabold text-slate-900">No applicants yet</h4>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            No candidates have submitted applications for this job opening.
          </p>
        </div>
      )}

      {/* Instruction when no job is selected */}
      {!selectedJobId && (
        <div className="bg-slate-50 border border-slate-200/50 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mx-auto">
            <ClipboardList className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold text-slate-500">
            Please select a job listing above to view and audit its applicant pipeline.
          </p>
        </div>
      )}

      {/* Applicants List */}
      {selectedJobId && !isAppsLoading && applications.length > 0 && (
        <div className="space-y-6">
          {applications.map((app) => (
            <Card key={app.id} className="bg-white border-slate-100 p-8 hover:shadow-md transition-all duration-200 space-y-6">
              {/* Header row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-slate-50">
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-950">
                    {app.candidate.first_name} {app.candidate.last_name || ''}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {app.candidate.email}
                    </span>
                    {app.candidate.phone_number && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          {app.candidate.phone_number}
                        </span>
                      </>
                    )}
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      Applied: {formatDate(app.applied_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(app.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateClick(app)}
                    className="font-bold border-slate-200"
                  >
                    <Edit3 className="h-3.5 w-3.5 mr-1" />
                    <span>Audit Status</span>
                  </Button>
                </div>
              </div>

              {/* Middle Section: AI Score and Resume */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* AI Insights Card */}
                <div className="md:col-span-2 border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block">
                      AI Compatibility Scoring
                    </span>
                    {app.match_score !== null && app.match_score !== undefined && (
                      <Badge variant={getMatchScoreVariant(app.match_score)} styleType="solid">
                        {app.match_score}% Compatibility
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block">
                        Matched Skills
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {app.matched_skills && app.matched_skills.length > 0 ? (
                          app.matched_skills.map((s, i) => (
                            <Badge key={i} variant="success" styleType="soft" className="text-[10px] font-bold px-2 py-0.5">
                              {s}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic font-semibold">None detected</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider block">
                        Missing Skills
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {app.missing_skills && app.missing_skills.length > 0 ? (
                          app.missing_skills.map((s, i) => (
                            <Badge key={i} variant="warning" styleType="soft" className="text-[10px] font-bold px-2 py-0.5">
                              {s}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic font-semibold">None detected</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Candidate Attachments */}
                <div className="border border-slate-100 rounded-2xl p-5 bg-white flex flex-col justify-center items-center text-center space-y-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold text-slate-800">Resume Document</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">PDF or Word format</p>
                  </div>
                  {app.resume && (
                    <a
                      href={app.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center font-bold text-xs bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-150 transition-all gap-1.5 w-full shadow-sm"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>View CV</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Recruiter Notes display */}
              {app.recruiter_notes && (
                <div className="bg-slate-50 rounded-2xl p-4 border-l-4 border-blue-500 space-y-1">
                  <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Recruiter Audit Notes</span>
                  <p className="text-xs text-slate-655 font-semibold leading-relaxed">
                    {app.recruiter_notes}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Audit Modal */}
      <Modal
        isOpen={!!editingApplication}
        onClose={() => setEditingApplication(null)}
        title="Audit Candidate Application"
      >
        {editingApplication && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Update Status
              </label>
              <select
                value={statusVal}
                onChange={(e) => setStatusVal(e.target.value)}
                className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold"
              >
                <option value="APPLIED">Applied (New)</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="INTERVIEW">Interview Scheduled</option>
                <option value="REJECTED">Rejected</option>
                <option value="HIRED">Hired</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Audit / Recruiter Notes
              </label>
              <textarea
                value={notesVal}
                onChange={(e) => setNotesVal(e.target.value)}
                placeholder="Log internal feedback, interview details, or salary bands discussion..."
                rows={4}
                className="w-full rounded-xl border border-slate-200 p-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingApplication(null)}
                className="font-bold border-slate-200"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSaveStatus}
                className="font-bold px-6"
                isLoading={updateStatusMutation.isPending}
              >
                Save Audit
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
