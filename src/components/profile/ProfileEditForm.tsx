import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import {
  Briefcase,
  Camera,
  Globe,
  Code,
  Loader2,
  Mail,
  MapPin,
  PencilLine,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react'
import { updateAuthenticatedUser } from '../../store/auth/authStore'
import type { UserData } from './ProfileHeader'

type EditableStatus = 'active' | 'busy' | 'incognito'

type EditableProfileData = UserData & {
  id?: string | number
  email?: string
  avatar?: string
  photoBase64?: string
  statusMessage?: string
}

type ValidationErrors = Partial<Record<'name' | 'headline' | 'location' | 'bio' | 'githubUrl' | 'linkedinUrl' | 'websiteUrl' | 'links' | 'photo', string>>

interface ProfileEditFormProps {
  initialUser: EditableProfileData
}

const PROFILE_STORAGE_PREFIX = 'ethoshub-profile'
const MAX_BIO_LENGTH = 500
const MAX_STATUS_MESSAGE_LENGTH = 60
const MAX_PHOTO_SIZE = 5 * 1024 * 1024

function normalizeStatus(value?: string): EditableStatus {
  if (value === 'busy' || value === 'incognito') {
    return value
  }

  return 'active'
}

function createInitialProfile(user: EditableProfileData): EditableProfileData {
  return {
    id: user.id,
    email: user.email || '',
    name: user.name || '',
    headline: user.headline || '',
    location: user.location || '',
    status: normalizeStatus(user.status),
    statusMessage: user.statusMessage || '',
    bio: user.bio || '',
    githubUrl: user.githubUrl || '',
    linkedinUrl: user.linkedinUrl || '',
    websiteUrl: user.websiteUrl || '',
    photoBase64: user.photoBase64 || user.avatar || '',
  }
}

function getStorageKey(userId?: string | number): string {
  return `${PROFILE_STORAGE_PREFIX}:${String(userId || 'anonymous')}`
}

function readStoredProfile(userId?: string | number): Partial<EditableProfileData> {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const rawValue = window.localStorage.getItem(getStorageKey(userId))
    return rawValue ? (JSON.parse(rawValue) as Partial<EditableProfileData>) : {}
  } catch {
    return {}
  }
}

function writeStoredProfile(profile: EditableProfileData): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(getStorageKey(profile.id), JSON.stringify(profile))
}

function normalizeUrl(value: string): string {
  return value.trim()
}

function isValidAbsoluteUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function matchesHost(value: string, expectedHost: string): boolean {
  if (!value) {
    return true
  }

  try {
    const parsed = new URL(value)
    return parsed.hostname === expectedHost || parsed.hostname.endsWith(`.${expectedHost}`)
  } catch {
    return false
  }
}

function validateProfile(data: EditableProfileData): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!data.name?.trim()) {
    errors.name = 'El nombre completo es obligatorio.'
  } else if (data.name.trim().length < 3) {
    errors.name = 'Ingresa al menos 3 caracteres en el nombre.'
  } else if (data.name.trim().length > 80) {
    errors.name = 'El nombre no puede exceder los 80 caracteres.'
  }

  if (!data.headline?.trim()) {
    errors.headline = 'El titulo profesional es obligatorio.'
  } else if (data.headline.trim().length < 4) {
    errors.headline = 'Describe tu perfil con al menos 4 caracteres.'
  } else if (data.headline.trim().length > 100) {
    errors.headline = 'El titulo profesional no puede exceder los 100 caracteres.'
  }

  if (!data.location?.trim()) {
    errors.location = 'La ubicacion es obligatoria.'
  } else if (data.location.trim().length < 2) {
    errors.location = 'Ingresa una ubicacion valida.'
  } else if (data.location.trim().length > 80) {
    errors.location = 'La ubicacion no puede exceder los 80 caracteres.'
  }

  if (!data.bio?.trim()) {
    errors.bio = 'La biografia es obligatoria.'
  } else if (data.bio.trim().length < 20) {
    errors.bio = 'La biografia debe tener al menos 20 caracteres.'
  } else if (data.bio.trim().length > MAX_BIO_LENGTH) {
    errors.bio = `La biografia no puede superar los ${MAX_BIO_LENGTH} caracteres.`
  }

  const githubUrl = normalizeUrl(data.githubUrl || '')
  const linkedinUrl = normalizeUrl(data.linkedinUrl || '')
  const websiteUrl = normalizeUrl(data.websiteUrl || '')

  if (!githubUrl && !linkedinUrl && !websiteUrl) {
    errors.links = 'Agrega al menos un enlace profesional para tu perfil.'
  }

  if (githubUrl && (!isValidAbsoluteUrl(githubUrl) || !matchesHost(githubUrl, 'github.com'))) {
    errors.githubUrl = 'Ingresa una URL valida de GitHub.'
  }

  if (linkedinUrl && (!isValidAbsoluteUrl(linkedinUrl) || !matchesHost(linkedinUrl, 'linkedin.com'))) {
    errors.linkedinUrl = 'Ingresa una URL valida de LinkedIn.'
  }

  if (websiteUrl && !isValidAbsoluteUrl(websiteUrl)) {
    errors.websiteUrl = 'Ingresa una URL valida para tu sitio web.'
  }

  return errors
}

function getComparableProfile(data: EditableProfileData) {
  return {
    name: data.name?.trim() || '',
    headline: data.headline?.trim() || '',
    location: data.location?.trim() || '',
    status: normalizeStatus(data.status),
    statusMessage: data.statusMessage?.trim() || '',
    bio: data.bio?.trim() || '',
    githubUrl: normalizeUrl(data.githubUrl || ''),
    linkedinUrl: normalizeUrl(data.linkedinUrl || ''),
    websiteUrl: normalizeUrl(data.websiteUrl || ''),
    photoBase64: data.photoBase64 || '',
  }
}

function mapStatusToBackend(status: string | undefined): 'A' | 'B' | 'N' {
  if (status === 'busy') {
    return 'B'
  }

  if (status === 'incognito') {
    return 'N'
  }

  return 'A'
}

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('No se pudo procesar la imagen seleccionada.'))
    reader.readAsDataURL(file)
  })
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className='rounded-[28px] border border-border bg-card shadow-sm'>
      <div className='border-b border-border px-6 py-5 sm:px-8'>
        <h2 className='text-xl font-semibold text-foreground'>{title}</h2>
        <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
      </div>
      <div className='px-6 py-6 sm:px-8'>{children}</div>
    </section>
  )
}

function FieldError({ message, show = true }: { message?: string; show?: boolean }) {
  if (!message || !show) {
    return null
  }

  return <p className='mt-2 text-sm text-destructive'>{message}</p>
}

export function ProfileEditForm({ initialUser }: ProfileEditFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'warning' | 'error'; text: string } | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoError, setPhotoError] = useState('')
  const [formData, setFormData] = useState<EditableProfileData>(() => createInitialProfile(initialUser))
  const [originalData, setOriginalData] = useState<EditableProfileData>(() => createInitialProfile(initialUser))

  useEffect(() => {
    let isMounted = true

    async function loadProfile(): Promise<void> {
      const baseProfile = createInitialProfile(initialUser)
      const storedProfile = readStoredProfile(initialUser.id)
      const mergedProfile: EditableProfileData = {
        ...baseProfile,
        ...storedProfile,
      }

      if (!initialUser.id) {
        if (isMounted) {
          setFormData(mergedProfile)
          setOriginalData(mergedProfile)
          setIsLoading(false)
        }
        return
      }

      try {
        const [statusResponse, biographyResponse, heroResponse] = await Promise.allSettled([
          fetch(`/api/profile/status/${initialUser.id}`),
          fetch(`/api/biography/${initialUser.id}`),
          fetch(`/api/profile/hero-section/${initialUser.id}`),
        ])

        if (statusResponse.status === 'fulfilled' && statusResponse.value.ok) {
          const statusData = await statusResponse.value.json()
          mergedProfile.status = statusData.status === 'B' ? 'busy' : statusData.status === 'N' ? 'incognito' : 'active'
          mergedProfile.statusMessage = statusData.statusMessage || mergedProfile.statusMessage || ''
        }

        if (biographyResponse.status === 'fulfilled' && biographyResponse.value.ok) {
          const biography = await biographyResponse.value.text()
          mergedProfile.bio = biography || mergedProfile.bio || ''
        }

        if (heroResponse.status === 'fulfilled' && heroResponse.value.ok) {
          const heroData = await heroResponse.value.json()
          mergedProfile.name = heroData.name || mergedProfile.name || ''
          mergedProfile.headline = heroData.professionalTitle || heroData.headline || mergedProfile.headline || ''
          mergedProfile.photoBase64 = heroData.photoBase64 || mergedProfile.photoBase64 || ''
        }
      } catch (error) {
        console.error('No se pudo cargar el perfil desde el servidor.', error)
      } finally {
        if (!isMounted) {
          return
        }

        setFormData(mergedProfile)
        setOriginalData(mergedProfile)
        setIsLoading(false)
      }
    }

    void loadProfile()

    return () => {
      isMounted = false
    }
  }, [initialUser])

  const errors = useMemo(() => validateProfile(formData), [formData])
  const hasValidationErrors = Object.keys(errors).length > 0 || Boolean(photoError)
  const hasUnsavedChanges =
    JSON.stringify(getComparableProfile(formData)) !== JSON.stringify(getComparableProfile(originalData)) || Boolean(photoFile)

  useEffect(() => {
    if (!isEditing || !hasUnsavedChanges) {
      return undefined
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges, isEditing])

  const saveDisabled = !isEditing || isSaving || isLoading || !hasUnsavedChanges || hasValidationErrors
  const currentPhoto = formData.photoBase64 || ''
  const initials = (formData.name || initialUser.name || 'U').trim().charAt(0).toUpperCase()

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target

    setSubmitMessage(null)
    setFormData((current) => ({
      ...current,
      [name]:
        name === 'bio'
          ? value.slice(0, MAX_BIO_LENGTH)
          : name === 'statusMessage'
            ? value.slice(0, MAX_STATUS_MESSAGE_LENGTH)
            : value,
    }))
  }

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0]
    if (!nextFile) {
      return
    }

    setSubmitMessage(null)

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(nextFile.type)) {
      setPhotoError('Solo se permiten imagenes JPG, PNG o WebP.')
      return
    }

    if (nextFile.size > MAX_PHOTO_SIZE) {
      setPhotoError('La foto no puede exceder los 5 MB.')
      return
    }

    try {
      const dataUrl = await fileToDataUrl(nextFile)
      setPhotoFile(nextFile)
      setPhotoError('')
      setFormData((current) => ({
        ...current,
        photoBase64: dataUrl,
      }))
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : 'No se pudo leer la imagen seleccionada.')
    } finally {
      event.target.value = ''
    }
  }

  const handleCancel = () => {
    if (hasUnsavedChanges && !window.confirm('Tienes cambios sin guardar. Deseas descartarlos y salir del modo edicion?')) {
      return
    }

    setSubmitMessage(null)
    setPhotoError('')
    setPhotoFile(null)
    setFormData(originalData)
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (saveDisabled) {
      return
    }

    setIsSaving(true)
    setSubmitMessage(null)

    const normalizedProfile: EditableProfileData = {
      ...formData,
      name: formData.name?.trim() || '',
      headline: formData.headline?.trim() || '',
      location: formData.location?.trim() || '',
      bio: formData.bio?.trim() || '',
      statusMessage: formData.statusMessage?.trim() || '',
      githubUrl: normalizeUrl(formData.githubUrl || ''),
      linkedinUrl: normalizeUrl(formData.linkedinUrl || ''),
      websiteUrl: normalizeUrl(formData.websiteUrl || ''),
    }

    let remoteSaveFailed = false

    try {
      const payload = new FormData()
      payload.append(
        'data',
        new Blob(
          [
            JSON.stringify({
              userId: initialUser.id,
              name: normalizedProfile.name,
              professionalTitle: normalizedProfile.headline,
            }),
          ],
          { type: 'application/json' },
        ),
      )

      if (photoFile) {
        payload.append('photo', photoFile)
      }

      const heroResponse = await fetch('/api/profile/hero-section', {
        method: 'PATCH',
        body: payload,
      })

      if (!heroResponse.ok) {
        throw new Error('No se pudo actualizar la informacion basica del perfil.')
      }

      const statusParams = new URLSearchParams({
        status: mapStatusToBackend(normalizedProfile.status),
        message: normalizedProfile.statusMessage || '',
        incognito: String(normalizedProfile.status === 'incognito'),
      })

      const statusResponse = await fetch(`/api/profile/status?${statusParams.toString()}`, {
        method: 'PUT',
      })

      if (!statusResponse.ok) {
        throw new Error('No se pudo actualizar tu disponibilidad.')
      }

      const biographyResponse = await fetch('/api/biography', {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: normalizedProfile.bio || '',
      })

      if (!biographyResponse.ok) {
        throw new Error('No se pudo guardar la biografia del perfil.')
      }
    } catch (error) {
      remoteSaveFailed = true
      console.error('La sincronizacion del perfil fallo.', error)
    } finally {
      writeStoredProfile(normalizedProfile)
    }

    updateAuthenticatedUser({
      name: normalizedProfile.name,
      avatar: normalizedProfile.photoBase64 || undefined,
    })

    setOriginalData(normalizedProfile)
    setFormData(normalizedProfile)
    setPhotoFile(null)
    setPhotoError('')
    setIsEditing(false)
    setIsSaving(false)

    if (remoteSaveFailed) {
      setSubmitMessage({
        type: 'warning',
        text: 'Guardamos tus cambios en este navegador, pero no pudimos sincronizarlos completamente con el servidor.',
      })
      return
    }

    setSubmitMessage({
      type: 'success',
      text: 'Cambios guardados correctamente. Ya puedes salir con seguridad.',
    })
  }

  if (isLoading) {
    return (
      <div className='flex min-h-[320px] items-center justify-center rounded-[28px] border border-border bg-card'>
        <div className='flex items-center gap-3 text-muted-foreground'>
          <Loader2 className='h-5 w-5 animate-spin text-primary' />
          Cargando tu perfil...
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 rounded-[28px] border border-border bg-card p-6 shadow-sm sm:p-8'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
          <div>
            <p className='text-sm font-medium text-primary'>EthosHub</p>
            <h1 className='mt-1 text-3xl font-bold text-foreground'>Mi Perfil</h1>
            <p className='mt-2 max-w-2xl text-sm text-muted-foreground'>
              Gestiona tu informacion profesional, valida los enlaces de tu perfil y guarda tus cambios cuando todo este listo.
            </p>
          </div>

          <div className='flex flex-wrap gap-3'>
            {!isEditing ? (
              <button
                type='button'
                onClick={() => {
                  setSubmitMessage(null)
                  setIsEditing(true)
                }}
                className='inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground transition-opacity hover:opacity-90'
              >
                <PencilLine className='h-4 w-4' />
                Editar perfil
              </button>
            ) : (
              <>
                <button
                  type='button'
                  onClick={handleCancel}
                  disabled={isSaving}
                  className='inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 font-semibold text-foreground transition-colors hover:bg-accent disabled:opacity-60'
                >
                  <X className='h-4 w-4' />
                  Cancelar
                </button>
                <button
                  type='button'
                  onClick={handleSave}
                  disabled={saveDisabled}
                  className='inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {isSaving ? <Loader2 className='h-4 w-4 animate-spin' /> : <Save className='h-4 w-4' />}
                  Guardar cambios
                </button>
              </>
            )}
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-3 text-sm'>
          <span className='inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-muted-foreground'>
            <ShieldCheck className='h-4 w-4 text-primary' />
            {hasUnsavedChanges && isEditing ? 'Tienes cambios pendientes' : 'Perfil sincronizado'}
          </span>
          <span className='rounded-full border border-border px-3 py-1.5 text-muted-foreground'>
            Estado: {formData.status === 'busy' ? 'Trabajando actualmente' : formData.status === 'incognito' ? 'Modo incognito' : 'Disponible'}
          </span>
        </div>
      </div>

      {submitMessage ? (
        <div
          className={`rounded-2xl border px-5 py-4 text-sm ${
            submitMessage.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : submitMessage.type === 'warning'
                ? 'border-amber-200 bg-amber-50 text-amber-800'
                : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {submitMessage.text}
        </div>
      ) : null}

      <SectionCard title='Foto de perfil' description='Tu imagen publica dentro de EthosHub.'>
        <div className='flex flex-col gap-5 md:flex-row md:items-center md:justify-between'>
          <div className='flex items-center gap-4'>
            <div className='flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-muted text-3xl font-bold text-muted-foreground'>
              {currentPhoto ? <img src={currentPhoto} alt={formData.name || 'Foto de perfil'} className='h-full w-full object-cover' /> : initials}
            </div>

            <div>
              <p className='text-lg font-semibold text-foreground'>{formData.name || 'Tu nombre'}</p>
              <p className='mt-1 inline-flex items-center gap-2 text-sm text-muted-foreground'>
                <Mail className='h-4 w-4' />
                {formData.email || 'Sin correo disponible'}
              </p>
            </div>
          </div>

          <div className='space-y-2'>
            <input
              ref={fileInputRef}
              type='file'
              accept='.jpg,.jpeg,.png,.webp'
              className='hidden'
              onChange={(event) => {
                void handlePhotoChange(event)
              }}
              disabled={!isEditing}
            />
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              disabled={!isEditing}
              className='inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 font-semibold text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60'
            >
              <Camera className='h-4 w-4' />
              Cambiar foto
            </button>
            <FieldError message={photoError} show={isEditing} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title='Informacion basica' description='Datos principales de tu perfil profesional.'>
        <div className='grid gap-5 md:grid-cols-2'>
          <div>
            <label className='mb-2 block text-sm font-medium text-foreground'>
              Nombre completo <span className='text-destructive'>*</span>
            </label>
            <div className='relative'>
              <UserRound className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <input
                name='name'
                value={formData.name || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className='h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-base text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:bg-muted disabled:text-muted-foreground'
              />
            </div>
            <FieldError message={errors.name} show={isEditing} />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-foreground'>
              Ubicacion <span className='text-destructive'>*</span>
            </label>
            <div className='relative'>
              <MapPin className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <input
                name='location'
                value={formData.location || ''}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder='Ciudad, pais'
                className='h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-base text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:bg-muted disabled:text-muted-foreground'
              />
            </div>
            <FieldError message={errors.location} show={isEditing} />
          </div>

          <div className='md:col-span-2'>
            <label className='mb-2 block text-sm font-medium text-foreground'>
              Titulo profesional <span className='text-destructive'>*</span>
            </label>
            <input
              name='headline'
              value={formData.headline || ''}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder='Ej: Full Stack Developer | React & Node.js'
              className='h-11 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:bg-muted disabled:text-muted-foreground'
            />
            <FieldError message={errors.headline} show={isEditing} />
          </div>

          <div className='md:col-span-2'>
            <label className='mb-2 block text-sm font-medium text-foreground'>Disponibilidad</label>
            <select
              name='status'
              value={normalizeStatus(formData.status)}
              onChange={handleChange}
              disabled={!isEditing}
              className='h-11 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:bg-muted disabled:text-muted-foreground'
            >
              <option value='active'>Disponible para nuevas oportunidades</option>
              <option value='busy'>Trabajando actualmente</option>
              <option value='incognito'>No disponible por ahora</option>
            </select>
          </div>

          <div className='md:col-span-2'>
            <label className='mb-2 block text-sm font-medium text-foreground'>Mensaje de estado</label>
            <input
              name='statusMessage'
              value={formData.statusMessage || ''}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder='Ej: Abierto a roles frontend remotos'
              className='h-11 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:bg-muted disabled:text-muted-foreground'
            />
            <p className='mt-2 text-right text-xs text-muted-foreground'>
              {(formData.statusMessage || '').length}/{MAX_STATUS_MESSAGE_LENGTH}
            </p>
          </div>

          <div className='md:col-span-2'>
            <label className='mb-2 block text-sm font-medium text-foreground'>
              Biografia <span className='text-destructive'>*</span>
            </label>
            <textarea
              name='bio'
              value={formData.bio || ''}
              onChange={handleChange}
              disabled={!isEditing}
              rows={5}
              placeholder='Describe tu experiencia, enfoque y tecnologias con las que te gusta trabajar.'
              className='w-full rounded-2xl border border-input bg-background px-3 py-3 text-base text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:bg-muted disabled:text-muted-foreground'
            />
            <div className='mt-2 flex items-center justify-between gap-3'>
              <FieldError message={errors.bio} show={isEditing} />
              <p className='text-xs text-muted-foreground'>
                {(formData.bio || '').length}/{MAX_BIO_LENGTH}
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title='Enlaces sociales' description='Conecta tus perfiles y portafolio profesional.'>
        <div className='space-y-5'>
          <div>
            <label className='mb-2 block text-sm font-medium text-foreground'>GitHub</label>
            <div className='relative'>
              <Code className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <input
                name='githubUrl'
                value={formData.githubUrl || ''}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder='https://github.com/tu-usuario'
                className='h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-base text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:bg-muted disabled:text-muted-foreground'
              />
            </div>
            <FieldError message={errors.githubUrl} show={isEditing} />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-foreground'>LinkedIn</label>
            <div className='relative'>
              <Briefcase className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <input
                name='linkedinUrl'
                value={formData.linkedinUrl || ''}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder='https://linkedin.com/in/tu-usuario'
                className='h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-base text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:bg-muted disabled:text-muted-foreground'
              />
            </div>
            <FieldError message={errors.linkedinUrl} show={isEditing} />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-foreground'>Sitio web</label>
            <div className='relative'>
              <Globe className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <input
                name='websiteUrl'
                value={formData.websiteUrl || ''}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder='https://tu-sitio.com'
                className='h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-base text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:bg-muted disabled:text-muted-foreground'
              />
            </div>
            <FieldError message={errors.websiteUrl} show={isEditing} />
          </div>

          <FieldError message={errors.links} show={isEditing} />
        </div>
      </SectionCard>
    </div>
  )
}
