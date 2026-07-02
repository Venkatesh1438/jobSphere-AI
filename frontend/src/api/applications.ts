import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export interface Application {
  id: string
  job: {
    id: string
    title: string
    location: string
    employment_type: string
    experience_level: string
    salary_min: number | string | null
    salary_max: number | string | null
    status: string
  }
  company: {
    id: string
    company_name: string
    logo_url: string | null
    industry: string
    website: string | null
    location: string
  } | null
  candidate: {
    id: string
    first_name: string
    last_name: string
    email: string
    phone_number: string | null
  }
  resume: string
  cover_letter: string | null
  portfolio_url: string | null
  status: 'APPLIED' | 'REVIEWED' | 'SHORTLISTED' | 'INTERVIEW' | 'REJECTED' | 'HIRED'
  recruiter_notes: string | null
  applied_at: string
  updated_at: string
  match_score: number | null
  matched_skills: string[]
  missing_skills: string[]
}

interface ApplicationsResponse {
  success: boolean
  data: Application[]
}

export function useCandidateApplications() {
  return useQuery<ApplicationsResponse>({
    queryKey: ['applications', 'me'],
    queryFn: async () => {
      const response = await api.get('/applications/me/')
      return response.data
    },
  })
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/applications/${id}/withdraw/`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', 'me'] })
    },
  })
}

export function useJobApplications(jobId: string) {
  return useQuery<ApplicationsResponse>({
    queryKey: ['applications', 'job', jobId],
    queryFn: async () => {
      const response = await api.get(`/jobs/${jobId}/applications/`)
      return response.data
    },
    enabled: !!jobId,
  })
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      status,
      recruiter_notes,
    }: {
      id: string
      status: string
      recruiter_notes?: string
    }) => {
      const response = await api.patch(`/applications/${id}/status/`, {
        status,
        recruiter_notes,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

export function useApplyJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, formData }: { jobId: string; formData: FormData }) => {
      const response = await api.post(`/jobs/${jobId}/apply/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}
