import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Building2, Camera, CheckCircle2, Edit3, Globe, Loader2, Mail, Save, User, Users, X } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { SocialLinks } from './SocialLinks'
import {
  completeRecruiterProfile,
  fetchRecruiterProfile,
  type CompleteRecruiterProfilePayload,
  type RecruiterProfile,
} from '../../services/profile/profileService'

type RecruiterSection = 'basic' | 'company' | 'contact' | 'links'

function SidebarButton({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean
  label: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left font-medium transition-colors ${
        active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-colors'>
      <div className='flex items-center gap-2 border-b border-gray-200 bg-gray-50/50 p-6'>
        {icon}
        <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
      </div>
      <div className='p-6'>{children}</div>
    </div>
  )
}

function readOnlyInputClass(isEditingSection: boolean): string {
  return isEditingSection
    ? 'border-border bg-slate-100 text-slate-700 ring-1 ring-slate-300/90 dark:!border-slate-300 dark:!bg-slate-100 dark:!text-slate-900 dark:!ring-slate-300/90'
    : ''
}

function buildPayload(profile: RecruiterProfile): CompleteRecruiterProfilePayload {
  return {
    firstName: profile.basicInfo.firstName || '',
    lastName: profile.basicInfo.lastName || '',
    professionalTitle: profile.basicInfo.professionalTitle || '',
    countryId: profile.basicInfo.countryId || '',
    companyName: profile.companyInfo.companyName || '',
    industry: profile.companyInfo.industry || '',
    companySize: Number(profile.companyInfo.companySize || 0),
    websiteUrl: profile.companyInfo.websiteUrl || '',
    nit: typeof profile.companyInfo.nit === 'number' ? profile.companyInfo.nit : undefined,
    contactFirstName: profile.companyInfo.contactFirstName || '',
    contactLastName: profile.companyInfo.contactLastName || '',
    socialLinks: (profile.socialLinks || [])
      .filter((link) => (link.platformId ?? link.plataformId) && String(link.url || '').trim())
      .map((link) => ({
        platformId: Number(link.platformId ?? link.plataformId),
        url: String(link.url || '').trim(),
      })),
    academicRecords: Array.isArray(profile.academicRecords) ? profile.academicRecords : [],
    workExperiences: Array.isArray(profile.workExperiences) ? profile.workExperiences : [],
  }
}

function getFieldError(errors: Record<string, string | null>, fields: string[]): string | null {
  for (const field of fields) {
    if (errors[field]) {
      return errors[field]
    }
  }

  return null
}

export default function RecruiterProfileSetupForm() {
  const [activeSection, setActiveSection] = useState<RecruiterSection>('basic')
  const [editingSection, setEditingSection] = useState<RecruiterSection | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [originalProfile, setOriginalProfile] = useState<RecruiterProfile | null>(null)
  const [profileState, setProfileState] = useState<RecruiterProfile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      try {
        const loadedProfile = await fetchRecruiterProfile()
        console.log('Recruiter profile response:', loadedProfile)
        console.log('Recruiter socialLinks received:', loadedProfile.socialLinks)

        if (!isMounted) {
          return
        }

        setOriginalProfile(loadedProfile)
        setProfileState(loadedProfile)
        setPhotoPreview(loadedProfile.photoBase64 || null)
      } catch (error) {
        if (!isMounted) {
          return
        }

        setErrors({
          global: error instanceof Error ? error.message : 'No se pudo cargar el perfil del reclutador.',
        })
      } finally {
        if (isMounted) {
          setIsLoadingData(false)
        }
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [])

  const currentSectionError = useMemo(() => {
    if (activeSection === 'basic') {
      return getFieldError(errors, ['firstName', 'lastName', 'professionalTitle', 'countryId'])
    }

    if (activeSection === 'company') {
      return getFieldError(errors, ['companyName', 'industry', 'companySize', 'websiteUrl', 'nit'])
    }

    if (activeSection === 'contact') {
      return getFieldError(errors, ['contactFirstName', 'contactLastName'])
    }

    return getFieldError(errors, ['socialLinks'])
  }, [activeSection, errors])

  const isEditingCurrentSection = editingSection === activeSection

  const updateBasicField = (field: keyof RecruiterProfile['basicInfo'], value: string) => {
    setProfileState((current) => {
      if (!current) {
        return current
      }

      return {
        ...current,
        basicInfo: {
          ...current.basicInfo,
          [field]: value,
        },
      }
    })
    setErrors((current) => ({ ...current, [field]: null, global: null }))
    setSuccessMessage(null)
  }

  const updateCompanyField = (
    field: keyof RecruiterProfile['companyInfo'],
    value: string | number | undefined,
  ) => {
    setProfileState((current) => {
      if (!current) {
        return current
      }

      return {
        ...current,
        companyInfo: {
          ...current.companyInfo,
          [field]: value,
        },
      }
    })
    setErrors((current) => ({ ...current, [field]: null, global: null }))
    setSuccessMessage(null)
  }

  const updateSocialLinks = (
    socialLinks: Array<{ sociallinksId?: number; plataformId: string | number; url: string }>,
  ) => {
    setProfileState((current) => {
      if (!current) {
        return current
      }

      return {
        ...current,
        socialLinks,
      }
    })
    setErrors((current) => ({ ...current, socialLinks: null, global: null }))
    setSuccessMessage(null)
  }

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleCancelSection = () => {
    if (!originalProfile) {
      return
    }

    setProfileState(originalProfile)
    setPhotoPreview(originalProfile.photoBase64 || null)
    setEditingSection(null)
    setErrors({})
    setSuccessMessage(null)
  }

  const handleSaveSection = async (section: RecruiterSection) => {
    if (!profileState) {
      return
    }

    const nextErrors: Record<string, string | null> = {}

    if (!profileState.companyInfo.companyName.trim()) {
      nextErrors.companyName = 'El nombre de la empresa es obligatorio.'
    }

    if (!profileState.companyInfo.industry.trim()) {
      nextErrors.industry = 'La industria es obligatoria.'
    }

    if (profileState.companyInfo.websiteUrl && !/^https?:\/\/.+/i.test(profileState.companyInfo.websiteUrl)) {
      nextErrors.websiteUrl = 'La web debe iniciar con http:// o https://'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsSaving(true)
    setErrors({})
    setSuccessMessage(null)

    try {
      const payload = buildPayload(profileState)
      console.log('Recruiter profile PUT payload:', payload)
      await completeRecruiterProfile(payload)

      const refreshedProfile = await fetchRecruiterProfile()
      setOriginalProfile(refreshedProfile)
      setProfileState(refreshedProfile)
      setPhotoPreview(refreshedProfile.photoBase64 || null)
      setEditingSection(null)
      setSuccessMessage(`Cambios guardados correctamente en ${section}.`)
    } catch (error) {
      setErrors({
        global: error instanceof Error ? error.message : 'Ocurrió un error inesperado al guardar.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoadingData || !profileState) {
    return (
      <div className='flex justify-center py-20'>
        <Loader2 className='h-6 w-6 animate-spin text-indigo-600' />
      </div>
    )
  }

  return (
    <div className='mx-auto mt-8 mb-20 flex max-w-6xl flex-col gap-8 px-4 md:flex-row'>
      <aside className='w-full shrink-0 md:w-64'>
        <div className='sticky top-8 space-y-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
            <h2 className='mb-4 px-2 text-lg font-bold text-gray-800'>Configuracion</h2>
            <nav className='flex flex-col gap-1'>
              <SidebarButton
                active={activeSection === 'basic'}
                label='Informacion Basica'
                icon={<User className='h-5 w-5' />}
                onClick={() => setActiveSection('basic')}
              />
              <SidebarButton
                active={activeSection === 'company'}
                label='Empresa'
                icon={<Building2 className='h-5 w-5' />}
                onClick={() => setActiveSection('company')}
              />
              <SidebarButton
                active={activeSection === 'contact'}
                label='Contacto'
                icon={<Users className='h-5 w-5' />}
                onClick={() => setActiveSection('contact')}
              />
              <SidebarButton
                active={activeSection === 'links'}
                label='Enlaces'
                icon={<Globe className='h-5 w-5' />}
                onClick={() => setActiveSection('links')}
              />
            </nav>
          </div>
        </div>
      </aside>

      <main className='flex min-w-0 flex-1 flex-col'>
        {errors.global ? (
          <div className='mb-4 rounded-xl border bg-red-50 p-4 text-sm font-medium text-red-800'>{errors.global}</div>
        ) : null}

        {successMessage ? (
          <div className='mb-4 flex items-center gap-2 rounded-xl border bg-green-50 p-4 text-sm font-medium text-green-800'>
            <CheckCircle2 className='h-5 w-5' />
            {successMessage}
          </div>
        ) : null}

        {currentSectionError ? (
          <div className='mb-4 rounded-xl border bg-amber-50 p-4 text-sm font-medium text-amber-800'>{currentSectionError}</div>
        ) : null}

        <div className='flex-1 space-y-6'>
          {activeSection === 'basic' ? (
            <SectionCard title='Información Básica' icon={<User className='h-5 w-5 text-gray-500' />}>
              <div className='space-y-6 text-left'>
                <div className='flex items-center gap-6'>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='.jpg,.jpeg,.png,.webp'
                    className='hidden'
                    disabled={!isEditingCurrentSection}
                    onChange={handlePhotoChange}
                  />

                  <button
                    type='button'
                    onClick={() => isEditingCurrentSection && fileInputRef.current?.click()}
                    disabled={!isEditingCurrentSection}
                    className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed ${
                      isEditingCurrentSection
                        ? 'cursor-pointer border-gray-300 bg-gray-100 hover:bg-gray-200'
                        : 'cursor-default border-gray-200 bg-gray-50'
                    }`}
                  >
                    {photoPreview ? (
                      <img src={photoPreview} alt='Preview' className='h-full w-full object-cover' />
                    ) : (
                      <Camera className={`h-6 w-6 ${isEditingCurrentSection ? 'text-gray-400' : 'text-gray-300'}`} />
                    )}
                  </button>

                  <div className='flex flex-col'>
                    <p className='text-sm font-medium text-gray-700 dark:text-gray-200'>Imagen de perfil reclutador</p>
                  </div>
                </div>

                <div className='grid gap-4 md:grid-cols-2'>
                  <label className='space-y-2'>
                    <span className='block text-sm font-medium text-gray-700'>User ID</span>
                    <Input value={String(profileState.userId)} disabled className={readOnlyInputClass(isEditingCurrentSection)} />
                  </label>

                  <label className='space-y-2'>
                    <span className='block text-sm font-medium text-gray-700'>Profile ID</span>
                    <Input value={String(profileState.profileId)} disabled className={readOnlyInputClass(isEditingCurrentSection)} />
                  </label>

                  <label className='space-y-2'>
                    <span className='block text-sm font-medium text-gray-700'>Tipo de usuario</span>
                    <Input value={profileState.userType || ''} disabled className={readOnlyInputClass(isEditingCurrentSection)} />
                  </label>

                  <label className='space-y-2'>
                    <span className='block text-sm font-medium text-gray-700'>Correo</span>
                    <Input value={profileState.email || ''} disabled className={readOnlyInputClass(isEditingCurrentSection)} />
                  </label>

                  <label className='space-y-2 md:col-span-2'>
                    <span className='block text-sm font-medium text-gray-700'>Nombre visible</span>
                    <Input
                      value={profileState.basicInfo.fullName || ''}
                      disabled
                      className={readOnlyInputClass(isEditingCurrentSection)}
                    />
                  </label>

                  <label className='space-y-2'>
                    <span className='block text-sm font-medium text-gray-700'>Nombre</span>
                    <Input
                      value={profileState.basicInfo.firstName || ''}
                      onChange={(event) => updateBasicField('firstName', event.target.value)}
                      disabled={!isEditingCurrentSection}
                    />
                  </label>

                  <label className='space-y-2'>
                    <span className='block text-sm font-medium text-gray-700'>Apellido</span>
                    <Input
                      value={profileState.basicInfo.lastName || ''}
                      onChange={(event) => updateBasicField('lastName', event.target.value)}
                      disabled={!isEditingCurrentSection}
                    />
                  </label>

                  <label className='space-y-2'>
                    <span className='block text-sm font-medium text-gray-700'>Titulo Profesional</span>
                    <Input
                      value={profileState.basicInfo.professionalTitle || ''}
                      onChange={(event) => updateBasicField('professionalTitle', event.target.value)}
                      disabled={!isEditingCurrentSection}
                    />
                  </label>

                  <label className='space-y-2'>
                    <span className='block text-sm font-medium text-gray-700'>Pais</span>
                    <Input
                      value={profileState.basicInfo.countryId || ''}
                      onChange={(event) => updateBasicField('countryId', event.target.value)}
                      disabled={!isEditingCurrentSection}
                    />
                  </label>
                </div>
              </div>
            </SectionCard>
          ) : null}

          {activeSection === 'company' ? (
            <SectionCard title='Información de la Empresa' icon={<Building2 className='h-5 w-5 text-gray-500' />}>
              <div className='grid gap-4 md:grid-cols-2'>
                <label className='space-y-2'>
                  <span className='block text-sm font-medium text-gray-700'>Nombre de la empresa</span>
                  <Input
                    value={profileState.companyInfo.companyName || ''}
                    onChange={(event) => updateCompanyField('companyName', event.target.value)}
                    disabled={!isEditingCurrentSection}
                  />
                </label>

                <label className='space-y-2'>
                  <span className='block text-sm font-medium text-gray-700'>Industria</span>
                  <Input
                    value={profileState.companyInfo.industry || ''}
                    onChange={(event) => updateCompanyField('industry', event.target.value)}
                    disabled={!isEditingCurrentSection}
                  />
                </label>

                <label className='space-y-2'>
                  <span className='block text-sm font-medium text-gray-700'>Tamaño de empresa</span>
                  <Input
                    type='number'
                    value={String(profileState.companyInfo.companySize ?? '')}
                    onChange={(event) => updateCompanyField('companySize', Number(event.target.value || 0))}
                    disabled={!isEditingCurrentSection}
                  />
                </label>

                <label className='space-y-2'>
                  <span className='block text-sm font-medium text-gray-700'>NIT</span>
                  <Input
                    type='number'
                    value={profileState.companyInfo.nit == null ? '' : String(profileState.companyInfo.nit)}
                    onChange={(event) =>
                      updateCompanyField('nit', event.target.value === '' ? undefined : Number(event.target.value))
                    }
                    disabled={!isEditingCurrentSection}
                  />
                </label>

                <label className='space-y-2 md:col-span-2'>
                  <span className='block text-sm font-medium text-gray-700'>Sitio web</span>
                  <Input
                    value={profileState.companyInfo.websiteUrl || ''}
                    onChange={(event) => updateCompanyField('websiteUrl', event.target.value)}
                    disabled={!isEditingCurrentSection}
                  />
                </label>
              </div>
            </SectionCard>
          ) : null}

          {activeSection === 'contact' ? (
            <SectionCard title='Datos de Contacto' icon={<Mail className='h-5 w-5 text-gray-500' />}>
              <div className='grid gap-4 md:grid-cols-2'>
                <label className='space-y-2'>
                  <span className='block text-sm font-medium text-gray-700'>Nombre del contacto</span>
                  <Input
                    value={profileState.companyInfo.contactFirstName || ''}
                    onChange={(event) => updateCompanyField('contactFirstName', event.target.value)}
                    disabled={!isEditingCurrentSection}
                  />
                </label>

                <label className='space-y-2'>
                  <span className='block text-sm font-medium text-gray-700'>Apellido del contacto</span>
                  <Input
                    value={profileState.companyInfo.contactLastName || ''}
                    onChange={(event) => updateCompanyField('contactLastName', event.target.value)}
                    disabled={!isEditingCurrentSection}
                  />
                </label>
              </div>
            </SectionCard>
          ) : null}

          {activeSection === 'links' ? (
            <SectionCard title='Enlaces y Presencia Pública' icon={<Globe className='h-5 w-5 text-gray-500' />}>
              <div className='space-y-4'>
                <div className='rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500'>
                  <p>
                    Social links registrados:{' '}
                    <span className='font-medium text-gray-700'>{profileState.socialLinks?.length ?? 0}</span>
                  </p>
                  <p className='mt-2'>
                    Registros academicos:{' '}
                    <span className='font-medium text-gray-700'>{profileState.academicRecords?.length ?? 0}</span>
                  </p>
                  <p className='mt-2'>
                    Experiencias laborales:{' '}
                    <span className='font-medium text-gray-700'>{profileState.workExperiences?.length ?? 0}</span>
                  </p>
                </div>

                <div className='rounded-xl border border-gray-200 bg-white p-4'>
                  <div className='mb-4 flex items-center gap-2'>
                    <Globe className='h-5 w-5 text-gray-500' />
                    <h4 className='text-md font-bold text-gray-900'>Redes Sociales</h4>
                  </div>

                  <SocialLinks
                    links={(profileState.socialLinks || []).map((link) => ({
                      sociallinksId: link.sociallinksId,
                      plataformId: link.plataformId ?? link.platformId ?? '',
                      url: link.url,
                    }))}
                    onChange={updateSocialLinks}
                    isEditing={isEditingCurrentSection}
                  />
                </div>
              </div>
            </SectionCard>
          ) : null}
        </div>

        <div className='mt-8 flex justify-end gap-3 border-t border-gray-200 pt-6'>
          {!isEditingCurrentSection ? (
            <Button
              type='button'
              onClick={() => {
                setEditingSection(activeSection)
                setErrors({})
                setSuccessMessage(null)
              }}
              className='bg-indigo-600 text-white hover:bg-indigo-700'
            >
              <Edit3 className='h-4 w-4' />
              Editar sección
            </Button>
          ) : (
            <>
              <Button type='button' variant='outline' onClick={handleCancelSection} disabled={isSaving}>
                <X className='h-4 w-4' />
                Cancelar
              </Button>
              <Button
                type='button'
                onClick={() => handleSaveSection(activeSection)}
                disabled={isSaving}
                className='bg-green-600 text-white hover:bg-green-700'
              >
                {isSaving ? <Loader2 className='h-4 w-4 animate-spin' /> : <Save className='h-4 w-4' />}
                Guardar cambios
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
