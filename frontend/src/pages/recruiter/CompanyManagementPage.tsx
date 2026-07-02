import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../hooks/useAuth'
import { useRecruiterCompany, useCreateCompany, useUpdateCompany } from '../../api/companies'
import PageHeader from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { toast } from 'react-hot-toast'
import { UploadCloud, Check, Plus, X, Globe, Building2 } from 'lucide-react'
import { useNotifications } from '../../context/NotificationContext'

interface CompanyFormInputs {
  company_name: string
  company_tagline?: string
  company_culture?: string
  industry: string
  website: string
  linkedin: string
  email: string
  phone: string
  location: string
  founded_year: number
  company_size: string
  about: string
}

export default function CompanyManagementPage() {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  
  // Queries & Mutations
  const { data: companyRes, isLoading, refetch } = useRecruiterCompany(user?.id)
  const company = companyRes?.data || null

  const createCompanyMutation = useCreateCompany()
  const updateCompanyMutation = useUpdateCompany()

  // State for uploads and previews
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  // Benefits tags state
  const [benefits, setBenefits] = useState<string[]>([])
  const [newBenefit, setNewBenefit] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CompanyFormInputs>()

  // Load existing company values into form
  useEffect(() => {
    if (company) {
      setValue('company_name', company.company_name)
      setValue('company_tagline', company.company_tagline || '')
      setValue('company_culture', company.company_culture || '')
      setValue('industry', company.industry)
      setValue('website', company.website || '')
      setValue('linkedin', company.linkedin || '')
      setValue('email', company.email || '')
      setValue('phone', company.phone || '')
      setValue('location', company.location)
      setValue('founded_year', company.founded_year || 2020)
      setValue('company_size', company.company_size || '11-50')
      setValue('about', company.about || '')

      if (company.company_benefits) {
        // Safe benefits parsing in case it is loaded differently
        try {
          const parsedBenefits = Array.isArray(company.company_benefits)
            ? company.company_benefits
            : JSON.parse(company.company_benefits as any)
          setBenefits(parsedBenefits || [])
        } catch {
          setBenefits([])
        }
      }

      // Only sync server URL when no local file is staged to avoid overwriting blob preview
      if (company.logo_url && !logoFile) setLogoPreview(company.logo_url)
      if (company.cover_image_url && !coverFile) setCoverPreview(company.cover_image_url)
    }
  }, [company, setValue]) // intentionally omit logoFile/coverFile to avoid re-runs on pick

  // Revoke blob URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith('blob:')) URL.revokeObjectURL(logoPreview)
      if (coverPreview?.startsWith('blob:')) URL.revokeObjectURL(coverPreview)
    }
  }, []) // run only on unmount

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo image size cannot exceed 5 MB.')
        return
      }
      // Revoke previous blob URL before creating a new one
      if (logoPreview?.startsWith('blob:')) URL.revokeObjectURL(logoPreview)
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Cover image size cannot exceed 10 MB.')
        return
      }
      // Revoke previous blob URL before creating a new one
      if (coverPreview?.startsWith('blob:')) URL.revokeObjectURL(coverPreview)
      setCoverFile(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const handleAddBenefit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setBenefits([...benefits, newBenefit.trim()])
      setNewBenefit('')
    }
  }

  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: CompanyFormInputs) => {
    const formData = new FormData()
    formData.append('company_name', data.company_name)
    formData.append('industry', data.industry)
    formData.append('website', data.website)
    formData.append('linkedin', data.linkedin)
    formData.append('email', data.email)
    formData.append('phone', data.phone)
    formData.append('location', data.location)
    formData.append('founded_year', data.founded_year.toString())
    formData.append('company_size', data.company_size)
    formData.append('about', data.about)

    if (data.company_tagline) formData.append('company_tagline', data.company_tagline)
    if (data.company_culture) formData.append('company_culture', data.company_culture)
    
    // Serialize benefits list to string as expected by Django REST serializer
    formData.append('company_benefits', JSON.stringify(benefits))

    if (logoFile) formData.append('company_logo', logoFile)
    if (coverFile) formData.append('company_cover', coverFile)

    try {
      let result: any
      if (company) {
        result = await updateCompanyMutation.mutateAsync({ id: company.id, formData })
        addNotification('Company Profile Updated', 'Successfully updated your company details.', 'success')
      } else {
        if (!logoFile) {
          toast.error('A company logo is required when creating a company profile.')
          return
        }
        result = await createCompanyMutation.mutateAsync(formData)
        addNotification('Company Profile Updated', 'Successfully created your company profile.', 'success')
      }

      // After save: clear staged files and sync preview with the server's confirmed URLs
      setLogoFile(null)
      setCoverFile(null)
      const savedCompany = result?.data
      if (savedCompany?.logo_url) setLogoPreview(savedCompany.logo_url)
      if (savedCompany?.cover_image_url) setCoverPreview(savedCompany.cover_image_url)

      refetch()
    } catch (err: any) {
      console.error(err)
      const fieldErrors = err.response?.data
      if (typeof fieldErrors === 'object') {
        // Output specific validation errors
        Object.entries(fieldErrors).forEach(([key, val]: any) => {
          toast.error(`${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
        })
      } else {
        toast.error('An error occurred while saving the company profile.')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <div className="h-8 bg-slate-100 animate-pulse rounded w-1/3" />
        <Card className="bg-white border-slate-100 p-8 h-96 animate-pulse" />
      </div>
    )
  }

  const isSubmitting = createCompanyMutation.isPending || updateCompanyMutation.isPending

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      <PageHeader
        title={company ? 'Update Company Profile' : 'Setup Company Profile'}
        subtitle="Manage details displayed to candidate seekers on public directories and job postings."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Cover Banner Section */}
        <Card className="bg-white border-slate-100 overflow-hidden shadow-sm p-0">
          <div className="px-8 pt-6 pb-3 border-b border-slate-50">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-blue-650" />
              <span>Cover Banner</span>
            </h3>
            <p className="text-xs text-slate-450 font-medium mt-0.5">Displayed at the top of your public company profile. Recommended 1200×300px. Max 10 MB.</p>
          </div>

          <div className="p-6">
            <label className="block cursor-pointer group">
              <div className="h-40 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden relative group-hover:border-blue-400 transition-colors">
                {coverPreview ? (
                  <>
                    <img
                      src={coverPreview}
                      alt="Company Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm text-slate-800 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2">
                        <UploadCloud className="h-4 w-4" />
                        <span>Change Cover Image</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                    <UploadCloud className="h-8 w-8 group-hover:text-blue-500 transition-colors" />
                    <span className="text-xs font-bold uppercase tracking-wider group-hover:text-blue-500 transition-colors">Click to Upload Cover Banner</span>
                    <span className="text-[11px] text-slate-400">PNG, JPG, WEBP up to 10 MB</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
            </label>
          </div>
        </Card>

        {/* Company Logo Section */}
        <Card className="bg-white border-slate-100 shadow-sm p-0">
          <div className="px-8 pt-6 pb-3 border-b border-slate-50">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-650" />
              <span>Company Logo</span>
              {!company && <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full ml-1">Required</span>}
            </h3>
            <p className="text-xs text-slate-450 font-medium mt-0.5">Shown on job postings, search results, and your company profile. Square image recommended. Max 5 MB.</p>
          </div>

          <div className="p-6 flex items-center gap-8">
            {/* Logo Preview Circle */}
            <div className="flex-shrink-0">
              <div className="h-28 w-28 rounded-3xl border-2 border-dashed border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center relative group">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Company Logo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-1">
                    <Building2 className="h-8 w-8" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">No Logo</span>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Controls */}
            <div className="flex flex-col gap-3">
              <label className="cursor-pointer">
                <div className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-blue-500/20">
                  <UploadCloud className="h-4 w-4" />
                  <span>{logoPreview ? 'Change Logo' : 'Upload Logo'}</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
              {logoFile && (
                <div className="flex items-center gap-2 text-xs text-green-600 font-semibold">
                  <Check className="h-3.5 w-3.5" />
                  <span>{logoFile.name}</span>
                </div>
              )}
              {!logoFile && !logoPreview && (
                <p className="text-xs text-slate-450 font-medium max-w-[220px]">
                  PNG or JPG, at least 200×200px recommended for best display quality.
                </p>
              )}
              {logoPreview && !logoFile && (
                <button
                  type="button"
                  onClick={() => { setLogoPreview(null); setLogoFile(null) }}
                  className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-semibold transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  Remove Logo
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Basic Information */}
        <Card className="bg-white border-slate-100 p-8 shadow-sm space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-50 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-650" />
            <span>Basic Details</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Company Name"
              placeholder="e.g. Acme Corporation"
              error={errors.company_name?.message}
              {...register('company_name', { required: 'Company name is required' })}
            />

            <Input
              label="Tagline"
              placeholder="e.g. Innovating cloud architectures"
              error={errors.company_tagline?.message}
              {...register('company_tagline')}
            />

            <Input
              label="Industry"
              placeholder="e.g. Software / Tech"
              error={errors.industry?.message}
              {...register('industry', { required: 'Industry is required' })}
            />

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-1">Company Size</label>
              <select
                className="w-full h-10 px-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold"
                {...register('company_size')}
              >
                <option value="1-10">1-10 Employees</option>
                <option value="11-50">11-50 Employees</option>
                <option value="51-200">51-200 Employees</option>
                <option value="201-500">201-500 Employees</option>
                <option value="501-1000">501-1000 Employees</option>
                <option value="1000+">1000+ Employees</option>
              </select>
            </div>

            <Input
              label="Founded Year"
              type="number"
              placeholder="e.g. 2018"
              error={errors.founded_year?.message}
              {...register('founded_year', {
                required: 'Founded year is required',
                valueAsNumber: true,
                min: { value: 1800, message: 'Invalid year' },
                max: { value: new Date().getFullYear(), message: 'Cannot be in the future' }
              })}
            />

            <Input
              label="Location"
              placeholder="e.g. San Francisco, CA"
              error={errors.location?.message}
              {...register('location', { required: 'Location is required' })}
            />
          </div>
        </Card>

        {/* Contact details */}
        <Card className="bg-white border-slate-100 p-8 shadow-sm space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-50 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-655" />
            <span>Connect & Contact Info</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Website URL"
              type="url"
              placeholder="https://company.com"
              error={errors.website?.message}
              {...register('website', {
                required: 'Website is required',
                pattern: { value: /^https?:\/\/.*$/, message: 'Must start with http:// or https://' }
              })}
            />

            <Input
              label="LinkedIn Page"
              type="url"
              placeholder="https://linkedin.com/company/profile"
              error={errors.linkedin?.message}
              {...register('linkedin', {
                required: 'LinkedIn page is required',
                pattern: { value: /^https?:\/\/(www\.)?linkedin\.com\/.*$/, message: 'Must be a valid LinkedIn Company link' }
              })}
            />

            <Input
              label="Public HR Email"
              type="email"
              placeholder="hr@company.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'HR Email is required',
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email format' }
              })}
            />

            <Input
              label="Contact Phone"
              placeholder="+1234567890"
              error={errors.phone?.message}
              {...register('phone', {
                required: 'Phone number is required',
                pattern: { value: /^\+?[0-9\s\-()]{7,20}$/, message: 'Invalid phone format (e.g. +1234567890)' }
              })}
            />
          </div>
        </Card>

        {/* About & Culture */}
        <Card className="bg-white border-slate-100 p-8 shadow-sm space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-50">
            About & Culture
          </h3>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">About Company</label>
              <textarea
                placeholder="Describe your company, missions, and products..."
                rows={5}
                className="w-full rounded-2xl border border-slate-200 p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                {...register('about', { required: 'About field is required' })}
              />
              {errors.about?.message && (
                <span className="text-xs text-red-500 font-semibold">{errors.about.message}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Company Culture (Optional)</label>
              <textarea
                placeholder="What is it like to work at your company? Highlight team practices..."
                rows={4}
                className="w-full rounded-2xl border border-slate-200 p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                {...register('company_culture')}
              />
            </div>
          </div>
        </Card>

        {/* Benefits tags */}
        <Card className="bg-white border-slate-100 p-8 shadow-sm space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-50">
            Perks & Benefits
          </h3>

          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="e.g. Dental Care, Remote days, Free lunch"
                className="flex-1 h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    if (newBenefit.trim()) {
                      setBenefits([...benefits, newBenefit.trim()])
                      setNewBenefit('')
                    }
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddBenefit}
                className="font-bold border-slate-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Perk
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {benefits.length === 0 ? (
                <span className="text-xs text-slate-450 font-semibold italic">No benefits tags added yet.</span>
              ) : (
                benefits.map((benefit, index) => (
                  <Badge
                    key={index}
                    variant="primary"
                    styleType="soft"
                    className="pl-3 pr-1.5 py-1 text-xs font-bold rounded-lg flex items-center space-x-1 border border-blue-100"
                  >
                    <span>{benefit}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(index)}
                      className="p-0.5 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>
        </Card>

        {/* Submit Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            variant="primary"
            className="font-bold px-8 shadow-md shadow-blue-500/10"
            isLoading={isSubmitting}
          >
            <Check className="h-4 w-4 mr-1.5" />
            <span>Save Company Details</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
