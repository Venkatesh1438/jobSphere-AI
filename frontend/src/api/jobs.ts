import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export interface Job {
  id: string
  title: string
  description: string
  location: string
  employment_type: string
  experience_level: string
  salary_min: number | string | null
  salary_max: number | string | null
  skills_required: string[]
  status: string
  application_deadline: string | null
  created_at: string
  updated_at: string
  recruiter?: {
    id: string
    email: string
    first_name: string
    last_name: string
    role: string
  }
  company?: {
    id: string
    company_name: string
    logo_url: string | null
    company_tagline: string | null
    industry: string
    website: string | null
    location: string
    verified: boolean
  } | null
}

interface JobsResponse {
  success: boolean
  count: number
  next: string | null
  previous: string | null
  data: Job[]
}

export interface JobsParams {
  search?: string
  employment_type?: string
  experience_level?: string
  location?: string
  salary_min?: number | string
  salary_max?: number | string
  page?: number
}

export function useJobs(params?: JobsParams, options?: any) {
  return useQuery<JobsResponse>({
    queryKey: ['jobs', params],
    queryFn: async () => {
      const response = await api.get('/jobs/', { params })
      return response.data
    },
    ...options
  })
}

export function useJobDetails(id: string) {
  return useQuery<{ success: boolean; data: Job }>({
    queryKey: ['job', id],
    queryFn: async () => {
      const response = await api.get(`/jobs/${id}/`)
      return response.data
    },
    enabled: !!id,
  })
}

export function useRecruiterJobs(recruiterId: string | undefined, params?: JobsParams) {
  const query = useJobs(params)
  // Encapsulate client-side filtering so we can easily swap it out if the backend supports it later
  const myJobs = query.data?.data?.filter((j) => j.recruiter?.id === recruiterId) || []
  return {
    ...query,
    data: query.data ? { ...query.data, data: myJobs } : undefined,
  }
}

export function useCreateJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<Job, 'id' | 'created_at' | 'updated_at' | 'recruiter'>) => {
      const response = await api.post('/jobs/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

export function useUpdateJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Job> }) => {
      const response = await api.patch(`/jobs/${id}/`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['job', variables.id] })
    },
  })
}

export function useDeleteJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/jobs/${id}/`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

export function useChangeJobStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' }) => {
      const response = await api.patch(`/jobs/${id}/status/`, { status })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['job', variables.id] })
    },
  })
}

