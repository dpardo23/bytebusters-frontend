import { useState, type FormEvent } from 'react'
import { Code2, Eye, EyeOff, LogIn } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/auth/useAuth'
import Button from '../ui/Button'
import Input from '../ui/Input'

function LinkedinIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' className='h-5 w-5 fill-current'>
      <path d='M4.98 3.5A2.48 2.48 0 1 0 5 8.46 2.48 2.48 0 0 0 4.98 3.5zM3 9h4v12H3zM9 9h3.83v1.64h.05c.53-1 1.84-2.05 3.79-2.05C20.42 8.59 21 11.05 21 14.24V21h-4v-5.98c0-1.43-.03-3.27-1.99-3.27-2 0-2.31 1.56-2.31 3.17V21H9z' />
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

export default function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (value: string) => /.+@.+\..+/.test(value)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedEmail = email.trim()
    const nextErrors: { email?: string; password?: string } = {}

    if (!validateEmail(trimmedEmail)) {
      nextErrors.email = 'Ingresa un email valido'
    }

    if (!String(password || '').trim()) {
      nextErrors.password = 'Ingresa tu contrasena'
    }

    if (nextErrors.email || nextErrors.password) {
      setFieldErrors(nextErrors)
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    const result = await login({
      email: trimmedEmail,
      password,
    })

    if (!result.success) {
      const loginErrorMessage = 'error' in result ? result.error || 'No se pudo iniciar sesion' : 'No se pudo iniciar sesion'

      setFieldErrors({
        email: loginErrorMessage,
      })
      setIsSubmitting(false)
      return
    }

    navigate('/dashboard')
  }

  return (
    <div className='w-full max-w-xl px-4'>
      <div className='mb-8 text-center'>
        <Link to='/' className='inline-flex items-center gap-3 text-4xl font-bold text-foreground'>
          <span className='inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm'>
            <Code2 className='h-6 w-6' />
          </span>
          EthosHub
        </Link>
        <p className='mt-3 text-lg text-muted-foreground'>Bienvenido de vuelta</p>
      </div>

      <div className='rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8'>
        <h1 className='text-3xl font-bold text-foreground'>Iniciar sesion</h1>
        <p className='mt-2 text-muted-foreground'>Ingresa tus credenciales para acceder a tu cuenta.</p>

        <form className='mt-8 space-y-4' onSubmit={handleSubmit}>
          <div>
            <label htmlFor='email' className='mb-2 block text-sm font-medium text-foreground'>
              Email
            </label>
            <Input
              id='email'
              type='email'
              autoComplete='email'
              placeholder='tu@email.com'
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setFieldErrors((currentErrors) => ({
                  ...currentErrors,
                  email: undefined,
                }))
              }}
              aria-invalid={Boolean(fieldErrors.email)}
              required
            />
            <p className='mt-1 min-h-5 text-sm text-destructive'>{fieldErrors.email || ' '}</p>
          </div>

          <div>
            <div className='mb-2 flex items-center justify-between gap-3'>
              <label htmlFor='password' className='text-sm font-medium text-foreground'>
                Contrasena
              </label>
              <button
                type='button'
                className='text-sm font-medium text-primary transition-opacity hover:opacity-80'
              >
                Olvidaste tu contrasena?
              </button>
            </div>

            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                autoComplete='current-password'
                placeholder='Ingresa tu contrasena'
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setFieldErrors((currentErrors) => ({
                    ...currentErrors,
                    password: undefined,
                  }))
                }}
                className='pr-11'
                aria-invalid={Boolean(fieldErrors.password)}
                required
              />
              <button
                type='button'
                className='absolute right-1 top-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
                onClick={() => setShowPassword((currentValue) => !currentValue)}
                aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
              >
                {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              </button>
            </div>
            <p className='mt-1 min-h-5 text-sm text-destructive'>{fieldErrors.password || ' '}</p>
          </div>

          <Button type='submit' size='lg' className='mt-2 w-full' disabled={isSubmitting}>
            <LogIn className='h-4 w-4' />
            {isSubmitting ? 'Ingresando...' : 'Iniciar sesion'}
          </Button>
        </form>

        <div className='my-6 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-muted-foreground'>
          <span className='h-px flex-1 bg-border' />
          <span>O continua con</span>
          <span className='h-px flex-1 bg-border' />
        </div>

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <button
            type='button'
            className='inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#0a66c2]/20 bg-[#0a66c2] px-4 font-medium text-white shadow-sm transition-colors hover:bg-[#004182]'
          >
            <LinkedinIcon />
            Continuar con LinkedIn
          </button>

          <button
            type='button'
            className='inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#24292f] px-4 font-medium text-white shadow-sm transition-colors hover:bg-[#1b1f23]'
          >
            <GithubIcon />
            Continuar con GitHub
          </button>
        </div>

        <p className='mt-6 text-center text-sm text-muted-foreground'>
          No tienes cuenta?{' '}
          <Link to='/auth/register' className='font-semibold text-primary hover:underline'>
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  )
}
