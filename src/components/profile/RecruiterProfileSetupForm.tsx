import { useState } from 'react'
import { Building2, CheckCircle2, ChevronLeft, ChevronRight, Globe, Loader2, Save, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { completeRecruiterProfile } from '../../services/profile/profileService'

type RecruiterProfileValues = {
  companyName: string
  industry: string
  companySize: string
  website: string
  hiringFocus: string
}

const initialValues: RecruiterProfileValues = {
  companyName: '',
  industry: '',
  companySize: '',
  website: '',
  hiringFocus: '',
}

export default function RecruiterProfileSetupForm() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [values, setValues] = useState<RecruiterProfileValues>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof RecruiterProfileValues, string>>>({})
  const [formError, setFormError] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (field: keyof RecruiterProfileValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const validate = () => {
    const nextErrors: Partial<Record<keyof RecruiterProfileValues, string>> = {}

    if (!values.companyName.trim()) {
      nextErrors.companyName = 'Ingresa el nombre de la empresa'
    }

    if (!values.industry.trim()) {
      nextErrors.industry = 'Ingresa el rubro de la empresa'
    }

    if (!values.companySize.trim()) {
      nextErrors.companySize = 'Selecciona un tamano de empresa'
    }

    if (values.website && !/^https?:\/\/.+/i.test(values.website)) {
      nextErrors.website = 'La web debe iniciar con http:// o https://'
    }

    if (!values.hiringFocus.trim()) {
      nextErrors.hiringFocus = 'Describe brevemente que perfiles buscas'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const validateStepOne = () => {
    const nextErrors: Partial<Record<keyof RecruiterProfileValues, string>> = {}

    if (!values.companyName.trim()) {
      nextErrors.companyName = 'Ingresa el nombre de la empresa'
    }

    if (!values.industry.trim()) {
      nextErrors.industry = 'Ingresa el rubro de la empresa'
    }

    if (!values.companySize.trim()) {
      nextErrors.companySize = 'Selecciona un tamano de empresa'
    }

    if (values.website && !/^https?:\/\/.+/i.test(values.website)) {
      nextErrors.website = 'La web debe iniciar con http:// o https://'
    }

    setErrors((current) => ({
      ...current,
      companyName: nextErrors.companyName,
      industry: nextErrors.industry,
      companySize: nextErrors.companySize,
      website: nextErrors.website,
    }))

    return Object.keys(nextErrors).length === 0
  }

  const validateStepTwo = () => {
    const nextErrors: Partial<Record<keyof RecruiterProfileValues, string>> = {}

    if (!values.hiringFocus.trim()) {
      nextErrors.hiringFocus = 'Describe brevemente que perfiles buscas'
    }

    setErrors((current) => ({
      ...current,
      hiringFocus: nextErrors.hiringFocus,
    }))

    return Object.keys(nextErrors).length === 0
  }

  const isStepOneComplete =
    values.companyName.trim() &&
    values.industry.trim() &&
    values.companySize.trim() &&
    (!values.website || /^https?:\/\/.+/i.test(values.website))

  const isStepTwoComplete = values.hiringFocus.trim()

  const handleSave = () => {
    if (!validate()) {
      return
    }

    setFormError('')
    setIsSaving(true)

    const sizeMap: Record<string, number> = {
      '1-10': 10,
      '11-50': 50,
      '51-200': 200,
      '201+': 201,
    }

    completeRecruiterProfile({
      companyName: values.companyName.trim(),
      industry: values.industry.trim(),
      companySize: sizeMap[values.companySize] || 1,
      websiteUrl: values.website.trim() || undefined,
      hiringNeeds: values.hiringFocus.trim(),
    })
      .then(() => {
        alert('Perfil de reclutador guardado con exito')
        navigate('/')
      })
      .catch((error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : 'No se pudo guardar el perfil'
        setFormError(errorMessage)
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  return (
    <div className='mx-auto max-w-6xl'>
      <nav className='mb-8 flex items-center justify-center gap-4'>
        {[1, 2].map((step) => (
          <div key={step} className='flex items-center'>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition-colors ${
                currentStep >= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {currentStep > step ? <CheckCircle2 className='h-6 w-6' /> : step}
            </div>
            {step < 2 ? (
              <div className={`ml-4 h-1 w-12 rounded ${currentStep > step ? 'bg-primary' : 'bg-muted'}`} />
            ) : null}
          </div>
        ))}
      </nav>

      <section className='overflow-hidden rounded-2xl border border-border bg-card shadow-sm'>
        {currentStep === 1 ? (
          <div className='p-6 md:p-8'>
            <div className='mb-6 flex items-start gap-3'>
              <span className='inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                <Building2 className='h-5 w-5' />
              </span>
              <div>
                <h2 className='text-2xl font-semibold text-foreground'>Informacion de la empresa</h2>
                <p className='mt-1 text-sm text-muted-foreground'>
                  Completa estos datos para publicar vacantes y gestionar candidatos.
                </p>
              </div>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <label className='text-sm text-foreground'>
                Nombre de la empresa
                <input
                  type='text'
                  value={values.companyName}
                  onChange={(event) => handleChange('companyName', event.target.value)}
                  className='mt-1 block w-full rounded-lg border border-border px-3 py-2 focus:border-primary focus:outline-none'
                  placeholder='ByteBusters S.A.'
                />
                <span className='mt-1 block min-h-5 text-xs text-destructive'>{errors.companyName || ' '}</span>
              </label>

              <label className='text-sm text-foreground'>
                Rubro
                <input
                  type='text'
                  value={values.industry}
                  onChange={(event) => handleChange('industry', event.target.value)}
                  className='mt-1 block w-full rounded-lg border border-border px-3 py-2 focus:border-primary focus:outline-none'
                  placeholder='Software, Fintech, E-commerce...'
                />
                <span className='mt-1 block min-h-5 text-xs text-destructive'>{errors.industry || ' '}</span>
              </label>

              <label className='text-sm text-foreground'>
                Tamano de empresa
                <select
                  value={values.companySize}
                  onChange={(event) => handleChange('companySize', event.target.value)}
                  className='mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 focus:border-primary focus:outline-none'
                >
                  <option value=''>Seleccionar</option>
                  <option value='1-10'>1 a 10 personas</option>
                  <option value='11-50'>11 a 50 personas</option>
                  <option value='51-200'>51 a 200 personas</option>
                  <option value='201+'>Mas de 200 personas</option>
                </select>
                <span className='mt-1 block min-h-5 text-xs text-destructive'>{errors.companySize || ' '}</span>
              </label>

              <label className='text-sm text-foreground'>
                Sitio web
                <div className='relative mt-1'>
                  <Globe className='pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                  <input
                    type='url'
                    value={values.website}
                    onChange={(event) => handleChange('website', event.target.value)}
                    className='block w-full rounded-lg border border-border py-2 pl-9 pr-3 focus:border-primary focus:outline-none'
                    placeholder='https://tuempresa.com'
                  />
                </div>
                <span className='mt-1 block min-h-5 text-xs text-destructive'>{errors.website || ' '}</span>
              </label>
            </div>
          </div>
        ) : null}

        {currentStep === 2 ? (
          <div className='p-6 md:p-8'>
            <div className='mb-6 flex items-start gap-3'>
              <span className='inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                <Users className='h-5 w-5' />
              </span>
              <div>
                <h2 className='text-2xl font-semibold text-foreground'>Perfiles que buscas</h2>
                <p className='mt-1 text-sm text-muted-foreground'>
                  Describe brevemente los perfiles clave que necesitas contratar.
                </p>
              </div>
            </div>

            <label className='block text-sm text-foreground'>
              Que perfiles necesitas contratar
              <div className='relative mt-1'>
                <Users className='pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <textarea
                  rows={5}
                  value={values.hiringFocus}
                  onChange={(event) => handleChange('hiringFocus', event.target.value)}
                  className='block w-full rounded-lg border border-border py-2 pl-9 pr-3 focus:border-primary focus:outline-none'
                  placeholder='Ejemplo: Frontend React SSR, Backend Java, QA Automation...'
                />
              </div>
              <span className='mt-1 block min-h-5 text-xs text-destructive'>{errors.hiringFocus || ' '}</span>
            </label>
          </div>
        ) : null}

        <div className='flex items-center justify-between border-t border-border bg-muted/20 p-6'>
          <button
            type='button'
            onClick={() => setCurrentStep(1)}
            className={`inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground ${
              currentStep === 1 ? 'invisible' : ''
            }`}
          >
            <ChevronLeft className='h-4 w-4' /> Anterior
          </button>

          {currentStep === 1 ? (
            <button
              type='button'
              onClick={() => {
                if (!validateStepOne()) {
                  return
                }
                setCurrentStep(2)
              }}
              disabled={!isStepOneComplete}
              className='inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70'
            >
              Siguiente <ChevronRight className='h-4 w-4' />
            </button>
          ) : (
            <button
              type='button'
              onClick={() => {
                if (!validateStepTwo()) {
                  return
                }
                handleSave()
              }}
              disabled={isSaving || !isStepTwoComplete}
              className='inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70'
            >
              {isSaving ? <Loader2 className='h-4 w-4 animate-spin' /> : <Save className='h-4 w-4' />}
              Guardar perfil reclutador
            </button>
          )}
        </div>
      </section>

      {formError ? <p className='mt-3 text-sm text-destructive'>{formError}</p> : null}
    </div>
  )
}
