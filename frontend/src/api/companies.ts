import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export interface Company {
  id: string
  company_name: string
  company_tagline: string | null
  company_culture: string | null
  company_benefits: string | null
  industry: string
  website: string | null
  linkedin: string | null
  email: string | null
  phone: string | null
  location: string
  founded_year: number | null
  company_size: string | null
  about: string | null
  verified: boolean
  logo_url: string | null
  cover_image_url: string | null
  active_jobs_count: number
  created_at: string
  updated_at: string
  recruiter?: {
    id: string
    email: string
    first_name: string
    last_name: string
    role: string
  }
}

interface CompaniesResponse {
  success: boolean
  count: number
  next: string | null
  previous: string | null
  data: Company[]
}

export function useCompanies(params?: { search?: string }, options?: any) {
  return useQuery<CompaniesResponse>({
    queryKey: ['companies', params],
    queryFn: async () => {
      const response = await api.get('/companies/', { params })
      return response.data
    },
    ...options
  })
}

export function useCompanyDetails(id: string) {
  return useQuery<{ success: boolean; data: Company }>({
    queryKey: ['company', id],
    queryFn: async () => {
      const response = await api.get(`/companies/${id}/`)
      return response.data
    },
    enabled: !!id,
  })
}

export function useRecruiterCompany(recruiterId: string | undefined) {
  const query = useCompanies()
  const company = query.data?.data?.find((c) => c.recruiter?.id === recruiterId) || null
  return {
    ...query,
    data: query.data ? { ...query.data, data: company } : undefined,
  }
}

export function useCreateCompany() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/companies/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
  })
}

export function useUpdateCompany() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const response = await api.patch(`/companies/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      queryClient.invalidateQueries({ queryKey: ['company', variables.id] })
    },
  })
}

