import { useEffect, useState, type FormEvent } from 'react'
import { Briefcase, CheckCircle2, Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { getRegisterFieldError, type RegisterField, type RegisterValues } from '../../lib/validations/authValidations'
import useAuth from '../../hooks/auth/useAuth'

const API_BASE_URL = String(import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')

function GoogleIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' className='h-5 w-5'>
      <path
        fill='#4285F4'
        d='M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.31h6.44a5.51 5.51 0 0 1-2.39 3.62v3h3.87c2.26-2.08 3.57-5.15 3.57-8.66z'
      />
      <path
        fill='#34A853'
        d='M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.87-3c-1.07.72-2.44 1.14-4.08 1.14-3.14 0-5.8-2.12-6.75-4.96H1.25v3.11A12 12 0 0 0 12 24z'
      />
      <path
        fill='#FBBC05'
        d='M5.25 14.28A7.2 7.2 0 0 1 4.87 12c0-.79.14-1.56.38-2.28V6.61H1.25A12 12 0 0 0 0 12c0 1.93.46 3.75 1.25 5.39l4-3.11z'
      />
      <path
        fill='#EA4335'
        d='M12 4.77c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.25 6.61l4 3.11c.95-2.84 3.61-4.95 6.75-4.95z'
      />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' className='h-5 w-5 fill-current'>
      <path d='M12 0a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.74-1.33-1.74-1.08-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.06 1.83 2.79 1.3 3.47 1 .1-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.94 0-1.31.47-2.39 1.24-3.23-.12-.3-.54-1.53.12-3.18 0 0 1.01-.33 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.61-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.58A12 12 0 0 0 12 0z' />
    </svg>
  )
}

export default function ProfessionalRegisterForm() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<RegisterField, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const redirectToOAuthProvider = (provider: 'github' | 'google') => {
    window.location.replace(`${API_BASE_URL}/api/auth/oauth/${provider}`)
  }

  const updateFieldError = (field: RegisterField, nextValues: RegisterValues) => {
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: getRegisterFieldError(field, nextValues),
    }))
  }

  useEffect(() => {
    if (!showSuccessModal) return undefined

    const timeoutId = window.setTimeout(() => {
      navigate('/')
    }, 1200)

    return () => window.clearTimeout(timeoutId)
  }, [showSuccessModal, navigate])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const fieldsInOrder: RegisterField[] = ['name', 'email', 'password', 'confirmPassword']
    const nextValues = { name, email, password, confirmPassword }
    const firstInvalidField = fieldsInOrder.find((field) => getRegisterFieldError(field, nextValues))

    if (firstInvalidField) {
      setFieldErrors({
        [firstInvalidField]: getRegisterFieldError(firstInvalidField, nextValues),
      })
      return
    }

    setFieldErrors({})

    setIsSubmitting(true)
    const result = await register({ name, email, password })

    if (result.success) {
      setShowSuccessModal(true)
      return
    }

    setFieldErrors({
      email: ('error' in result && result.error) || 'No se pudo crear la cuenta',
    })
    setIsSubmitting(false)
  }

  return (
    <>
      <div className='w-full max-w-2xl px-4'>
        <div className='mx-auto mb-8 max-w-xl text-center'>
          <Link to='/' className='mb-2 inline-flex items-center gap-2 text-4xl font-bold text-foreground'>
            <span className='inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground'>
              <Briefcase className='h-5 w-5' />
            </span>
            EthosHub
          </Link>
          <p className='text-lg text-muted-foreground'>Crea tu cuenta de profesional</p>
        </div>

        <div className='rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8'>
          <h1 className='text-3xl font-bold text-foreground'>Crear Cuenta</h1>
          <p className='mt-2 text-muted-foreground'>Completa el formulario para comenzar a crear tu portafolio.</p>

          <form className='mt-6 space-y-4' onSubmit={handleSubmit}>
            <div>
              <label htmlFor='fullName' className='mb-2 block text-sm font-medium text-foreground'>
                Nombre completo
              </label>
              <Input
                id='fullName'
                placeholder='Tu nombre'
                value={name}
                onChange={(event) => {
                  const nextName = event.target.value
                  setName(nextName)
                  updateFieldError('name', { name: nextName, email, password, confirmPassword })
                }}
                onBlur={() => updateFieldError('name', { name, email, password, confirmPassword })}
                aria-invalid={Boolean(fieldErrors.name)}
                required
              />
              <p className='mt-1 min-h-5 text-sm text-destructive'>
                {fieldErrors.name || ' '}
              </p>
            </div>

            <div>
              <label htmlFor='email' className='mb-2 block text-sm font-medium text-foreground'>
                Email
              </label>
              <Input
                id='email'
                type='email'
                placeholder='tu@email.com'
                value={email}
                onChange={(event) => {
                  const nextEmail = event.target.value
                  setEmail(nextEmail)
                  updateFieldError('email', { name, email: nextEmail, password, confirmPassword })
                }}
                onBlur={() => updateFieldError('email', { name, email, password, confirmPassword })}
                aria-invalid={Boolean(fieldErrors.email)}
                required
              />
              <p className='mt-1 min-h-5 text-sm text-destructive'>
                {fieldErrors.email || ' '}
              </p>
            </div>

            <div>
              <label htmlFor='password' className='mb-2 block text-sm font-medium text-foreground'>
                Contrasena
              </label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Minimo 6 caracteres'
                  value={password}
                  onChange={(event) => {
                    const nextPassword = event.target.value
                    setPassword(nextPassword)
                    updateFieldError('password', { name, email, password: nextPassword, confirmPassword })
                    if (confirmPassword || fieldErrors.confirmPassword) {
                      updateFieldError('confirmPassword', {
                        name,
                        email,
                        password: nextPassword,
                        confirmPassword,
                      })
                    }
                  }}
                  onBlur={() => updateFieldError('password', { name, email, password, confirmPassword })}
                  className='pr-11'
                  aria-invalid={Boolean(fieldErrors.password)}
                  required
                />
                <button
                  type='button'
                  className='absolute right-1 top-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground'
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                </button>
              </div>
              <p className='mt-1 min-h-5 text-sm text-destructive'>
                {fieldErrors.password || ' '}
              </p>
            </div>

            <div>
              <label htmlFor='confirmPassword' className='mb-2 block text-sm font-medium text-foreground'>
                Confirmar contrasena
              </label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='Repite la contrasena'
                value={confirmPassword}
                onChange={(event) => {
                  const nextConfirmPassword = event.target.value
                  setConfirmPassword(nextConfirmPassword)
                  updateFieldError('confirmPassword', {
                    name,
                    email,
                    password,
                    confirmPassword: nextConfirmPassword,
                  })
                }}
                onBlur={() => updateFieldError('confirmPassword', { name, email, password, confirmPassword })}
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
                required
              />
              <p className='mt-1 min-h-5 text-sm text-destructive'>
                {fieldErrors.confirmPassword || ' '}
              </p>
            </div>

            <Button type='submit' className='w-full' size='lg' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className='h-4 w-4 animate-spin' />
                  Creando cuenta...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </Button>
          </form>

          <div className='my-6 flex items-center gap-3 text-xs uppercase text-muted-foreground'>
            <span className='h-px flex-1 bg-border' />
            <span>O registrate con</span>
            <span className='h-px flex-1 bg-border' />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <button
              type='button'
              onClick={() => redirectToOAuthProvider('github')}
              className='inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#24292f] px-4 font-medium text-white shadow-sm transition-colors hover:bg-[#1b1f23]'
            >
              <GithubIcon />
              Registrate con GitHub
            </button>
            <button
              type='button'
              onClick={() => redirectToOAuthProvider('google')}
              className='inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-[#dadce0] bg-white px-4 font-medium text-[#3c4043] shadow-sm transition-colors hover:bg-[#f8f9fa]'
            >
              <GoogleIcon />
              Registrate con Google
            </button>
          </div>

          <p className='mt-6 text-center text-sm text-muted-foreground'>
            Ya tienes cuenta?{' '}
            <Link to='/auth/login' className='font-semibold text-primary hover:underline'>
              Iniciar sesion
            </Link>
          </p>
        </div>
      </div>

      {showSuccessModal ? (
        <div className='fixed inset-0 flex items-center justify-center bg-black/35 px-4' style={{ zIndex: 60 }}>
          <div className='w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-xl'>
            <div className='mb-4 flex justify-center'>
              <span className='inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg'>
                <CheckCircle2 className='h-11 w-11' strokeWidth={2.5} />
              </span>
            </div>
            <h3 className='text-xl font-bold text-foreground'>Cuenta creada</h3>
            <p className='mt-2 text-sm text-muted-foreground'>
              Tu cuenta se creo con exito. Te estamos llevando al inicio.
            </p>
          </div>
        </div>
      ) : null}
    </>
  )
}