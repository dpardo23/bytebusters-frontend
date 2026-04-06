import { useEffect, useState, type FormEvent } from 'react'
import { CheckCircle2, Eye, EyeOff, LoaderCircle, Network, Users, Webhook } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { getRegisterFieldError, type RegisterField, type RegisterValues } from '../../lib/validations/authValidations'
import useAuth from '../../hooks/auth/useAuth'

export default function RecruiterRegisterForm() {
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
              <Users className='h-5 w-5' />
            </span>
            DevFolio
          </Link>
          <p className='text-lg text-muted-foreground'>Crea tu cuenta de reclutador</p>
        </div>

        <div className='rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8'>
          <h1 className='text-3xl font-bold text-foreground'>Crear Cuenta</h1>
          <p className='mt-2 text-muted-foreground'>Completa el formulario para comenzar a buscar talento.</p>

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
            <Button variant='outline' className='w-full'>
              <Webhook className='h-4 w-4' /> GitHub
            </Button>
            <Button variant='outline' className='w-full'>
              <Network className='h-4 w-4' /> LinkedIn
            </Button>
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