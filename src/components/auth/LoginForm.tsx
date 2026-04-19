import { useState, type FormEvent, type ChangeEvent } from 'react'
import { Code2, Eye, EyeOff, LogIn } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/auth/useAuth'
import { isValidEmail, isValidPassword } from '../../lib/validations/authValidations'
import { requestPasswordResetCode, resetPasswordWithCode } from '../../services/auth/authService'
import Button from '../ui/Button'
import Input from '../ui/Input'

const LOGIN_VIEW = 'login'
const RECOVERY_REQUEST_VIEW = 'recovery-request'
const RECOVERY_RESET_VIEW = 'recovery-reset'
const API_BASE_URL = String(import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')
const OAUTH_INTENT_KEY = 'oauth_intent'

function GithubIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' className='h-5 w-5 fill-current'>
      <path d='M12 0a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.74-1.33-1.74-1.08-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.06 1.83 2.79 1.3 3.47 1 .1-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.94 0-1.31.47-2.39 1.24-3.23-.12-.3-.54-1.53.12-3.18 0 0 1.01-.33 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.61-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.58A12 12 0 0 0 12 0z' />
    </svg>
  )
}

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

function redirectToOAuthProvider(provider: 'github' | 'google') {
  sessionStorage.setItem(OAUTH_INTENT_KEY, 'login')
  window.location.assign(`${API_BASE_URL}/api/auth/oauth/${provider}?intent=login`)
}

export default function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [view, setView] = useState(LOGIN_VIEW)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginNotice, setLoginNotice] = useState('')
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [recoveryCode, setRecoveryCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [recoveryRequestError, setRecoveryRequestError] = useState('')
  const [recoveryCodeError, setRecoveryCodeError] = useState('')
  const [recoveryPasswordError, setRecoveryPasswordError] = useState('')
  const [recoverySuccess, setRecoverySuccess] = useState('')
  const [isRecoverySubmitting, setIsRecoverySubmitting] = useState(false)

  const resetRecoveryState = () => {
    setRecoveryRequestError('')
    setRecoveryCodeError('')
    setRecoveryPasswordError('')
    setRecoverySuccess('')
    setIsRecoverySubmitting(false)
    setRecoveryCode('')
    setNewPassword('')
    setShowNewPassword(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedEmail = email.trim()
    const nextErrors: { email?: string; password?: string } = {}

    if (!isValidEmail(trimmedEmail)) {
      nextErrors.email = 'Ingresa un email valido'
    }

    if (!String(password || '').trim()) {
      nextErrors.password = 'Ingresa tu contraseña'
    }

    if (nextErrors.email || nextErrors.password) {
      setFieldErrors(nextErrors)
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)
    setLoginNotice('')

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

    navigate(result.user?.id ? `/user/${result.user.id}` : '/profile')
  }

  const openRecoveryRequest = () => {
    resetRecoveryState()
    setRecoveryEmail(email.trim())
    setLoginNotice('')
    setView(RECOVERY_REQUEST_VIEW)
  }

  const returnToLogin = () => {
    resetRecoveryState()
    setView(LOGIN_VIEW)
  }

  const handleRecoveryRequestSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedEmail = recoveryEmail.trim()
    if (!isValidEmail(trimmedEmail)) {
      setRecoveryRequestError('Ingresa un email valido')
      setRecoverySuccess('')
      return
    }

    setRecoveryRequestError('')
    setRecoverySuccess('')
    setIsRecoverySubmitting(true)

    const result = await requestPasswordResetCode(trimmedEmail)
    if (!result.success) {
      setRecoveryRequestError('error' in result ? result.error : 'No se pudo enviar el codigo')
      setIsRecoverySubmitting(false)
      return
    }

    setRecoveryEmail(trimmedEmail)
    setRecoverySuccess(result.message)
    setIsRecoverySubmitting(false)
    window.setTimeout(() => {
      setRecoverySuccess('')
      setView(RECOVERY_RESET_VIEW)
    }, 700)
  }

  const handlePasswordResetSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!String(recoveryCode || '').trim()) {
      setRecoveryCodeError('Ingresa el codigo recibido')
      setRecoveryPasswordError('')
      setRecoverySuccess('')
      return
    }

    if (!isValidPassword(newPassword)) {
      setRecoveryCodeError('')
      setRecoveryPasswordError('Minimo 8 caracteres con mayuscula, minuscula, numero y simbolo')
      setRecoverySuccess('')
      return
    }

    setRecoveryCodeError('')
    setRecoveryPasswordError('')
    setRecoverySuccess('')
    setIsRecoverySubmitting(true)

    const result = await resetPasswordWithCode({
      email: recoveryEmail.trim(),
      code: recoveryCode.trim(),
      newPassword,
    })

    if (!result.success) {
      const backendError = 'error' in result ? result.error : 'No se pudo restablecer la contraseña'
      const normalizedError = String(backendError || '').toLowerCase()

      if (normalizedError.includes('la nueva contrasena no puede ser igual a la anterior')) {
        setRecoveryPasswordError('Debes ingresar una contraseña diferente a la actual')
      } else {
        setRecoveryPasswordError(backendError)
      }

      setIsRecoverySubmitting(false)
      return
    }

    setRecoverySuccess(result.message)
    setIsRecoverySubmitting(false)
    window.setTimeout(() => {
      setView(LOGIN_VIEW)
      setLoginNotice('Tu contraseña fue actualizada. Ya puedes iniciar sesion.')
      setEmail(recoveryEmail.trim())
      setPassword('')
      resetRecoveryState()
    }, 1000)
  }

  return (
    <div className='w-full max-w-xl px-4'>
      <div className='mb-8 text-center'>
        <Link to='/' className='inline-flex cursor-pointer items-center gap-3 text-4xl font-bold text-foreground'>
          <span className='inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm'>
            <Code2 className='h-6 w-6' />
          </span>
          EthosHub
        </Link>
        <p className='mt-3 text-lg text-muted-foreground'>Bienvenido de Vuelta</p>
      </div>

      <div className='rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8'>
        {view === LOGIN_VIEW ? (
          <>
            <h1 className='text-3xl font-bold text-foreground'>Iniciar Sesion</h1>
            <p className='mt-2 text-muted-foreground'>Ingresa tus credenciales para acceder a tu cuenta.</p>

            {loginNotice ? (
              <p className='mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700'>
                {loginNotice}
              </p>
            ) : null}

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
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
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
                    Contraseña
                  </label>
                  <button
                    type='button'
                    className='cursor-pointer text-sm font-medium text-primary transition-opacity hover:opacity-80'
                    onClick={openRecoveryRequest}
                  >
                    Olvidaste tu contraseña?
                  </button>
                </div>

                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='current-password'
                    placeholder='Ingresa tu contraseña'
                    value={password}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
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
                    className='absolute right-1 top-1 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
                    onClick={() => setShowPassword((currentValue) => !currentValue)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </button>
                </div>
                <p className='mt-1 min-h-5 text-sm text-destructive'>{fieldErrors.password || ' '}</p>
              </div>

              <Button type='submit' size='lg' className='mt-2 w-full cursor-pointer' disabled={isSubmitting}>
                <LogIn className='h-4 w-4' />
                {isSubmitting ? 'Ingresando...' : 'Iniciar Sesion'}
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
                onClick={() => redirectToOAuthProvider('github')}
                className='inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#24292f] px-4 font-medium text-white shadow-sm transition-colors hover:bg-[#1b1f23]'
              >
                <GithubIcon />
                Continuar con GitHub
              </button>

              <button
                type='button'
                onClick={() => redirectToOAuthProvider('google')}
                className='inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#dadce0] bg-[#ffffff] px-4 font-medium text-[#3c4043] shadow-sm transition-colors hover:bg-[#f8f9fa]'
              >
                <GoogleIcon />
                Continuar con Google
              </button>
            </div>

            <p className='mt-6 text-center text-sm text-muted-foreground'>
              No tienes cuenta?{' '}
              <Link to='/auth/register' className='cursor-pointer font-semibold text-primary hover:underline'>
                Crear Cuenta
              </Link>
            </p>
          </>
        ) : null}

        {view === RECOVERY_REQUEST_VIEW ? (
          <>
            <h1 className='text-3xl font-bold text-foreground'>Recuperar contraseña</h1>
            <p className='mt-2 text-muted-foreground'>Ingresa tu correo y te enviaremos un codigo de recuperacion.</p>

            {recoverySuccess ? (
              <p className='mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700'>
                {recoverySuccess}
              </p>
            ) : null}

            <form className='mt-8 space-y-4' onSubmit={handleRecoveryRequestSubmit}>
              <div>
                <label htmlFor='recoveryEmail' className='mb-2 block text-sm font-medium text-foreground'>
                  Email
                </label>
                <Input
                  id='recoveryEmail'
                  type='email'
                  autoComplete='email'
                  placeholder='tu@email.com'
                  value={recoveryEmail}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setRecoveryEmail(event.target.value)
                    setRecoveryRequestError('')
                  }}
                  required
                />
                <p className='mt-1 min-h-5 text-sm text-destructive'>{recoveryRequestError || ' '}</p>
              </div>

              <Button type='submit' size='lg' className='w-full cursor-pointer' disabled={isRecoverySubmitting}>
                {isRecoverySubmitting ? 'Enviando codigo...' : 'Enviar codigo'}
              </Button>
            </form>

            <button
              type='button'
              className='mt-4 cursor-pointer text-sm font-medium text-primary transition-opacity hover:opacity-80'
              onClick={returnToLogin}
            >
              Volver al Login
            </button>
          </>
        ) : null}

        {view === RECOVERY_RESET_VIEW ? (
          <>
            <h1 className='text-3xl font-bold text-foreground'>Nueva contraseña</h1>
            <p className='mt-2 text-muted-foreground'>Ingresa el codigo recibido y tu nueva contraseña.</p>

            {recoverySuccess ? (
              <p className='mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700'>
                {recoverySuccess}
              </p>
            ) : null}

            <form className='mt-8 space-y-4' onSubmit={handlePasswordResetSubmit}>
              <div>
                <label htmlFor='recoveryCode' className='mb-2 block text-sm font-medium text-foreground'>
                  Codigo
                </label>
                <Input
                  id='recoveryCode'
                  placeholder='Ingresa el codigo'
                  value={recoveryCode}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setRecoveryCode(event.target.value)
                    setRecoveryCodeError('')
                  }}
                  aria-invalid={Boolean(recoveryCodeError)}
                  className={recoveryCodeError ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}
                  required
                />
                <p className='mt-1 min-h-5 text-sm text-destructive'>{recoveryCodeError || ' '}</p>
              </div>

              <div>
                <label htmlFor='newPassword' className='mb-2 block text-sm font-medium text-foreground'>
                  Nueva contraseña
                </label>
                <div className='relative'>
                  <Input
                    id='newPassword'
                    type={showNewPassword ? 'text' : 'password'}
                    autoComplete='new-password'
                    placeholder='Nueva contraseña'
                    value={newPassword}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setNewPassword(event.target.value)
                      setRecoveryPasswordError('')
                    }}
                    className={`pr-11 ${recoveryPasswordError ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}`}
                    aria-invalid={Boolean(recoveryPasswordError)}
                    required
                  />
                  <button
                    type='button'
                    className='absolute right-1 top-1 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
                    onClick={() => setShowNewPassword((currentValue) => !currentValue)}
                    aria-label={showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showNewPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </button>
                </div>
                <p className='mt-1 min-h-5 text-sm text-destructive'>{recoveryPasswordError || ' '}</p>
              </div>

              <Button type='submit' size='lg' className='w-full cursor-pointer' disabled={isRecoverySubmitting}>
                {isRecoverySubmitting ? 'Actualizando...' : 'Guardar nueva contraseña'}
              </Button>
            </form>

            <button
              type='button'
              className='mt-4 cursor-pointer text-sm font-medium text-primary transition-opacity hover:opacity-80'
              onClick={() => {
                setRecoveryRequestError('')
                setRecoveryCodeError('')
                setRecoveryPasswordError('')
                setRecoverySuccess('')
                setView(RECOVERY_REQUEST_VIEW)
              }}
            >
              Cambiar email
            </button>
          </>
        ) : null}
      </div>
    </div>
  )
}
