import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Briefcase, Building2, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Mail, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/auth/useAuth'

type RecruiterOnboardingData = {
  companyName: string
  industry: string
  companySize: string
  website: string
  contactName: string
  contactEmail: string
  hiringFocus: string
}

const ONBOARDING_STORAGE_KEY = 'ethoshub-recruiter-onboarding'

function loadStoredOnboarding(email: string): Partial<RecruiterOnboardingData> {
  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY)
    if (!raw) {
      return {}
    }

    const parsed = JSON.parse(raw) as Record<string, RecruiterOnboardingData>
    return parsed[email] || {}
  } catch {
    return {}
  }
}

function saveOnboarding(email: string, data: RecruiterOnboardingData): void {
  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as Record<string, RecruiterOnboardingData>) : {}
    parsed[email] = data
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(parsed))
  } catch {
    // Ignore storage failures in mock mode.
  }
}

export default function RecruiterOnboardingForm() {
  const navigate = useNavigate()
  const { user, updateUserDetails } = useAuth()
  const stored = user?.email ? loadStoredOnboarding(user.email) : {}

  const [step, setStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState<RecruiterOnboardingData>({
    companyName: stored.companyName || '',
    industry: stored.industry || '',
    companySize: stored.companySize || '',
    website: stored.website || '',
    contactName: stored.contactName || '',
    contactEmail: stored.contactEmail || user?.email || '',
    hiringFocus: stored.hiringFocus || '',
  })

  const onChange = (field: keyof RecruiterOnboardingData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const isStepValid = () => {
    if (step === 1) {
      return form.companyName.trim() !== '' && form.industry.trim() !== ''
    }

    if (step === 2) {
      return form.contactName.trim() !== '' && form.contactEmail.trim() !== ''
    }

    return form.hiringFocus.trim().length >= 10
  }

  const handleFinish = async (event: FormEvent) => {
    event.preventDefault()
    if (!isStepValid()) {
      return
    }

    setIsSaving(true)

    if (user?.email) {
      saveOnboarding(user.email, form)
    }

    updateUserDetails({
      name: form.contactName || user?.name,
      company: form.companyName,
      website: form.website,
      bio: form.hiringFocus,
      profession: 'Recruiter',
    })

    window.setTimeout(() => {
      setIsSaving(false)
      navigate('/')
    }, 500)
  }

  return (
    <form onSubmit={handleFinish} className='mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-sm'>
      <div className='mb-6 flex items-center justify-center gap-4'>
        {[1, 2, 3].map((value) => (
          <div key={value} className='flex items-center'>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                step >= value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {step > value ? <CheckCircle2 className='h-5 w-5' /> : value}
            </div>
            {value < 3 ? <div className={`mx-3 h-1 w-10 rounded ${step > value ? 'bg-primary' : 'bg-muted'}`} /> : null}
          </div>
        ))}
      </div>

      {step === 1 ? (
        <section className='space-y-4'>
          <h2 className='text-2xl font-bold text-foreground'>Empresa</h2>
          <p className='text-sm text-muted-foreground'>Cuéntanos sobre tu empresa para personalizar tu experiencia.</p>

          <div>
            <label className='mb-1 block text-sm font-medium text-foreground'>Nombre de empresa</label>
            <div className='relative'>
              <Building2 className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <input
                className='h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary'
                value={form.companyName}
                onChange={onChange('companyName')}
                placeholder='Ej. ByteBusters SAS'
                required
              />
            </div>
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-foreground'>Industria</label>
            <input
              className='h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary'
              value={form.industry}
              onChange={onChange('industry')}
              placeholder='Ej. Software y TI'
              required
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-foreground'>Tamaño de empresa</label>
            <input
              className='h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary'
              value={form.companySize}
              onChange={onChange('companySize')}
              placeholder='Ej. 11-50 empleados'
            />
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className='space-y-4'>
          <h2 className='text-2xl font-bold text-foreground'>Contacto</h2>
          <p className='text-sm text-muted-foreground'>Define la persona de contacto principal para reclutamiento.</p>

          <div>
            <label className='mb-1 block text-sm font-medium text-foreground'>Nombre de contacto</label>
            <div className='relative'>
              <User className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <input
                className='h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary'
                value={form.contactName}
                onChange={onChange('contactName')}
                placeholder='Ej. Laura Perez'
                required
              />
            </div>
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-foreground'>Email de contacto</label>
            <div className='relative'>
              <Mail className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <input
                type='email'
                className='h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary'
                value={form.contactEmail}
                onChange={onChange('contactEmail')}
                placeholder='reclutamiento@empresa.com'
                required
              />
            </div>
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-foreground'>Sitio web</label>
            <input
              className='h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary'
              value={form.website}
              onChange={onChange('website')}
              placeholder='https://tuempresa.com'
            />
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className='space-y-4'>
          <h2 className='text-2xl font-bold text-foreground'>Objetivo de contratación</h2>
          <p className='text-sm text-muted-foreground'>Describe qué perfiles estás buscando actualmente.</p>

          <div className='relative'>
            <Briefcase className='pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
            <textarea
              className='min-h-36 w-full rounded-xl border border-border bg-background pl-10 pr-3 pt-3 text-sm outline-none focus:border-primary'
              value={form.hiringFocus}
              onChange={onChange('hiringFocus')}
              placeholder='Ej. Buscamos desarrolladores frontend con React y experiencia en producto...'
              required
            />
          </div>
        </section>
      ) : null}

      <div className='mt-8 flex items-center justify-between'>
        <button
          type='button'
          onClick={() => setStep((current) => Math.max(1, current - 1))}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-foreground ${step === 1 ? 'invisible' : 'hover:bg-accent'}`}
        >
          <ChevronLeft className='h-4 w-4' />
          Anterior
        </button>

        {step < 3 ? (
          <button
            type='button'
            disabled={!isStepValid()}
            onClick={() => setStep((current) => Math.min(3, current + 1))}
            className='inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60'
          >
            Siguiente
            <ChevronRight className='h-4 w-4' />
          </button>
        ) : (
          <button
            type='submit'
            disabled={isSaving || !isStepValid()}
            className='inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60'
          >
            {isSaving ? <Loader2 className='h-4 w-4 animate-spin' /> : <CheckCircle2 className='h-4 w-4' />}
            Finalizar
          </button>
        )}
      </div>
    </form>
  )
}
