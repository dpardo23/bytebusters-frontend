import { useState } from 'react'
import { Code2, Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/auth/useAuth'
import { getLoginFieldError, isValidEmail, isValidPassword } from '../../lib/validations/authValidations'
import { requestPasswordResetCode, resetPassword } from '../../services/auth/authService'
import Button from '../ui/Button'
import Input from '../ui/Input'
import ForgotPasswordStep from './ForgotPasswordStep'
import OAuthButtons from './OAuthButtons'
import ResetPasswordStep from './ResetPasswordStep'

const LOGIN_VIEW = 'login'
const FORGOT_PASSWORD_VIEW = 'forgot-password'
const RESET_PASSWORD_VIEW = 'reset-password'

export default function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [view, setView] = useState(LOGIN_VIEW)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginNotice, setLoginNotice] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotPasswordError, setForgotPasswordError] = useState('')
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('')
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [resetPasswordError, setResetPasswordError] = useState('')
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState('')
  const [isResettingPassword, setIsResettingPassword] = useState(false)

  const updateFieldError = (field, nextValues) => {
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: getLoginFieldError(field, nextValues),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextValues = { email, password }
    const fieldsInOrder = ['email', 'password']
    const firstInvalidField = fieldsInOrder.find((field) => getLoginFieldError(field, nextValues))

    if (firstInvalidField) {
      setFieldErrors({
        [firstInvalidField]: getLoginFieldError(firstInvalidField, nextValues),
      })
      return
    }

    setFieldErrors({})
    setLoginNotice('')
    setIsSubmitting(true)

    const result = await login({ email, password })

    if (result.success) {
      navigate('/dashboard')
      return
    }

    setFieldErrors({
      email: result.error || 'No se pudo iniciar sesion',
    })
    setIsSubmitting(false)
  }

  const resetRecoveryState = () => {
    setForgotPasswordError('')
    setForgotPasswordSuccess('')
    setIsSendingCode(false)
    setResetPasswordError('')
    setResetPasswordSuccess('')
    setIsResettingPassword(false)
    setResetCode('')
    setNewPassword('')
  }

  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault()

    if (!isValidEmail(forgotEmail)) {
      setForgotPasswordError('Ingresa un email valido')
      setForgotPasswordSuccess('')
      return
    }

    setForgotPasswordError('')
    setForgotPasswordSuccess('')
    setIsSendingCode(true)

    const result = await requestPasswordResetCode({ email: forgotEmail })

    if (!result.success) {
      setForgotPasswordError(result.error)
      setIsSendingCode(false)
      return
    }

    setForgotPasswordSuccess(result.message)
    setIsSendingCode(false)
    window.setTimeout(() => {
      setView(RESET_PASSWORD_VIEW)
      setForgotPasswordSuccess('')
    }, 700)
  }

  const handleResetPasswordSubmit = async (event) => {
    event.preventDefault()

    if (!String(resetCode || '').trim()) {
      setResetPasswordError('Ingresa el codigo recibido')
      setResetPasswordSuccess('')
      return
    }

    if (!isValidPassword(newPassword)) {
      setResetPasswordError('La contrasena debe tener al menos 6 caracteres')
      setResetPasswordSuccess('')
      return
    }

    setResetPasswordError('')
    setResetPasswordSuccess('')
    setIsResettingPassword(true)

    const result = await resetPassword({
      email: forgotEmail,
      code: resetCode,
      newPassword,
    })

    if (!result.success) {
      setResetPasswordError(result.error)
      setIsResettingPassword(false)
      return
    }

    setResetPasswordSuccess(result.message)
    setIsResettingPassword(false)
    window.setTimeout(() => {
      setView(LOGIN_VIEW)
      setLoginNotice('Tu contrasena fue restablecida. Ya puedes iniciar sesion.')
      setEmail(forgotEmail)
      setPassword('')
      resetRecoveryState()
    }, 1100)
  }

  const openForgotPassword = () => {
    resetRecoveryState()
    setForgotEmail(email)
    setLoginNotice('')
    setView(FORGOT_PASSWORD_VIEW)
  }

  const returnToLogin = () => {
    resetRecoveryState()
    setView(LOGIN_VIEW)
  }

  return (
    <div className='w-full max-w-xl px-4'>
      <div className='mb-8 text-center'>
        <Link to='/' className='inline-flex items-center gap-3 text-4xl font-bold text-foreground'>
          <span className='inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm'>
            <Code2 className='h-6 w-6' />
          </span>
          DevFolio
        </Link>
        <p className='mt-3 text-lg text-muted-foreground'>Bienvenido de vuelta</p>
      </div>

      <div className='rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8'>
        {view === LOGIN_VIEW ? (
          <>
            <h1 className='text-3xl font-bold text-foreground'>Iniciar Sesion</h1>
            <p className='mt-2 text-muted-foreground'>Ingresa tus credenciales para acceder a tu cuenta</p>

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
                  onChange={(event) => {
                    const nextEmail = event.target.value
                    setEmail(nextEmail)
                    updateFieldError('email', { email: nextEmail, password })
                  }}
                  onBlur={() => updateFieldError('email', { email, password })}
                  aria-invalid={Boolean(fieldErrors.email)}
                  required
                />
                <p className='mt-1 min-h-5 text-sm text-destructive'>
                  {fieldErrors.email || ' '}
                </p>
              </div>

              <div>
                <div className='mb-2 flex items-center justify-between gap-3'>
                  <label htmlFor='password' className='text-sm font-medium text-foreground'>
                    Contrasena
                  </label>
                  <button
                    type='button'
                    className='text-sm font-medium text-primary transition-opacity hover:opacity-80'
                    onClick={openForgotPassword}
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
                      const nextPassword = event.target.value
                      setPassword(nextPassword)
                      updateFieldError('password', { email, password: nextPassword })
                    }}
                    onBlur={() => updateFieldError('password', { email, password })}
                    className='pr-11'
                    aria-invalid={Boolean(fieldErrors.password)}
                    required
                  />
                  <button
                    type='button'
                    className='absolute right-1 top-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                  >
                    {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </button>
                </div>
                <p className='mt-1 min-h-5 text-sm text-destructive'>
                  {fieldErrors.password || ' '}
                </p>
              </div>

              <Button type='submit' size='lg' className='mt-2 w-full' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoaderCircle className='h-4 w-4 animate-spin' />
                    Iniciando sesion...
                  </>
                ) : (
                  'Iniciar Sesion'
                )}
              </Button>
            </form>

            <div className='my-6 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-muted-foreground'>
              <span className='h-px flex-1 bg-border' />
              <span>O continua con</span>
              <span className='h-px flex-1 bg-border' />
            </div>

            <OAuthButtons />

            <p className='mt-6 text-center text-sm text-muted-foreground'>
              No tienes cuenta?{' '}
              <Link to='/auth/register/professional' className='font-semibold text-primary hover:underline'>
                Crear cuenta
              </Link>
            </p>
          </>
        ) : null}

        {view === FORGOT_PASSWORD_VIEW ? (
          <ForgotPasswordStep
            email={forgotEmail}
            error={forgotPasswordError}
            success={forgotPasswordSuccess}
            isSubmitting={isSendingCode}
            onEmailChange={(value) => {
              setForgotEmail(value)
              setForgotPasswordError('')
            }}
            onSubmit={handleForgotPasswordSubmit}
            onBackToLogin={returnToLogin}
          />
        ) : null}

        {view === RESET_PASSWORD_VIEW ? (
          <ResetPasswordStep
            email={forgotEmail}
            code={resetCode}
            newPassword={newPassword}
            error={resetPasswordError}
            success={resetPasswordSuccess}
            isSubmitting={isResettingPassword}
            onCodeChange={(value) => {
              setResetCode(value)
              setResetPasswordError('')
            }}
            onNewPasswordChange={(value) => {
              setNewPassword(value)
              setResetPasswordError('')
            }}
            onSubmit={handleResetPasswordSubmit}
            onBackToEmailStep={() => {
              setResetPasswordError('')
              setResetPasswordSuccess('')
              setView(FORGOT_PASSWORD_VIEW)
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
