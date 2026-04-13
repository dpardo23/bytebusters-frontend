import { KeyRound, Mail, RefreshCcw, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import useAuth from '../../hooks/auth/useAuth'
import { isValidEmail, isValidPassword } from '../../lib/validations/authValidations'
import {
  confirmEmailChange,
  confirmPasswordChange,
  fetchRecruiterAccount,
  fetchUserAccount,
  requestEmailChange,
  requestPasswordChange,
} from '../../services/user/userService'
import type { UserAccount } from '../../types/user.types'

function SecurityCard({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <article className='rounded-3xl border border-border bg-card/95 p-6 shadow-sm backdrop-blur'>
      <span className='inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
        {icon}
      </span>
      <h2 className='mt-5 text-xl font-semibold text-foreground'>{title}</h2>
      <p className='mt-2 text-sm leading-6 text-muted-foreground'>{description}</p>
      <div className='mt-6'>{children}</div>
    </article>
  )
}

function formatAccountDate(value?: string) {
  if (!value) {
    return 'Sin fecha disponible'
  }

  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('es-BO', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(parsedDate)
}

export default function UserAccountPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [account, setAccount] = useState<UserAccount | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [emailFormError, setEmailFormError] = useState('')
  const [emailFormSuccess, setEmailFormSuccess] = useState('')
  const [hasRequestedEmailChange, setHasRequestedEmailChange] = useState(false)
  const [isRequestingEmailChange, setIsRequestingEmailChange] = useState(false)
  const [isConfirmingEmailChange, setIsConfirmingEmailChange] = useState(false)
  const [passwordCode, setPasswordCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordCodeError, setPasswordCodeError] = useState('')
  const [passwordNewError, setPasswordNewError] = useState('')
  const [passwordConfirmError, setPasswordConfirmError] = useState('')
  const [passwordFormError, setPasswordFormError] = useState('')
  const [passwordFormSuccess, setPasswordFormSuccess] = useState('')
  const [hasRequestedPasswordChange, setHasRequestedPasswordChange] = useState(false)
  const [isRequestingPasswordChange, setIsRequestingPasswordChange] = useState(false)
  const [isConfirmingPasswordChange, setIsConfirmingPasswordChange] = useState(false)
  const [activeSecurityTab, setActiveSecurityTab] = useState<'email' | 'password'>('email')
  const [securityModalState, setSecurityModalState] = useState<{
    open: boolean
    title: string
    description: string
    confirmLabel: string
    action: null | 'request-email-change' | 'confirm-email-change' | 'request-password-change' | 'confirm-password-change'
  }>({
    open: false,
    title: '',
    description: '',
    confirmLabel: '',
    action: null,
  })
  const isRecruiterAccount = user?.role === 'recruiter' || account?.userType === 'RECLUTADOR'

  async function loadUserAccount(nextUserId: string) {
    setIsLoading(true)
    setError('')

    try {
      const nextAccount = isRecruiterAccount ? await fetchRecruiterAccount() : await fetchUserAccount(nextUserId)
      setAccount(nextAccount)
      setEmailValue('')
    } catch (loadError) {
      setAccount(null)
      setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar la informacion del usuario')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    async function loadUserAccount() {
      if (!id) {
        return
      }

      try {
        const nextAccount = isRecruiterAccount ? await fetchRecruiterAccount() : await fetchUserAccount(id)
        if (!isMounted) {
          return
        }

        setAccount(nextAccount)
        setEmailValue('')
      } catch (loadError) {
        if (!isMounted) {
          return
        }

        setAccount(null)
        setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar la informacion del usuario')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadUserAccount()

    return () => {
      isMounted = false
    }
  }, [id, isRecruiterAccount])

  if (!id) {
    return <Navigate to='/' replace />
  }

  const handleRefreshAccount = async () => {
    await loadUserAccount(id)
  }

  const openSecurityModal = (
    action: NonNullable<typeof securityModalState.action>,
    title: string,
    description: string,
    confirmLabel: string,
  ) => {
    setSecurityModalState({
      open: true,
      title,
      description,
      confirmLabel,
      action,
    })
  }

  const closeSecurityModal = () => {
    setSecurityModalState((currentState) => ({
      ...currentState,
      open: false,
      action: null,
    }))
  }

  const requestEmailChangeAction = async () => {
    const normalizedEmail = emailValue.trim().toLowerCase()
    if (!isValidEmail(normalizedEmail)) {
      setEmailFormError('Ingresa un email valido')
      setEmailFormSuccess('')
      return
    }

    if (normalizedEmail === account?.email?.toLowerCase()) {
      setEmailFormError('Ingresa un correo diferente al actual')
      setEmailFormSuccess('')
      return
    }

    setEmailFormError('')
    setEmailFormSuccess('')
    setIsRequestingEmailChange(true)

    const result = await requestEmailChange(normalizedEmail)
    if (!result.success) {
      setEmailFormError('error' in result ? result.error : 'No se pudo enviar el codigo')
      setIsRequestingEmailChange(false)
      return
    }

    setHasRequestedEmailChange(true)
    setEmailFormSuccess(result.message)
    setIsRequestingEmailChange(false)
  }

  const confirmEmailChangeAction = async () => {
    const normalizedCode = emailCode.trim()
    if (!normalizedCode) {
      setEmailFormError('Ingresa el codigo enviado al nuevo correo')
      setEmailFormSuccess('')
      return
    }

    setEmailFormError('')
    setEmailFormSuccess('')
    setIsConfirmingEmailChange(true)

    const result = await confirmEmailChange(normalizedCode)
    if (!result.success) {
      setEmailFormError('error' in result ? result.error : 'No se pudo cambiar el correo')
      setIsConfirmingEmailChange(false)
      return
    }

    setEmailFormSuccess(result.message)
    setIsConfirmingEmailChange(false)
    setEmailCode('')
    setHasRequestedEmailChange(false)
    await logout()
    navigate('/auth/login', { replace: true })
  }

  const requestPasswordChangeAction = async () => {
    setPasswordCodeError('')
    setPasswordNewError('')
    setPasswordConfirmError('')
    setPasswordFormError('')
    setPasswordFormSuccess('')
    setIsRequestingPasswordChange(true)

    const result = await requestPasswordChange()
    if (!result.success) {
      setPasswordFormError('error' in result ? result.error : 'No se pudo enviar el codigo')
      setIsRequestingPasswordChange(false)
      return
    }

    setHasRequestedPasswordChange(true)
    setPasswordFormSuccess(result.message)
    setIsRequestingPasswordChange(false)
  }

  const confirmPasswordChangeAction = async () => {
    const normalizedCode = passwordCode.trim()
    if (!normalizedCode) {
      setPasswordCodeError('Ingresa el codigo enviado a tu correo actual')
      setPasswordNewError('')
      setPasswordConfirmError('')
      setPasswordFormError('')
      setPasswordFormSuccess('')
      return
    }

    if (!isValidPassword(newPassword)) {
      setPasswordCodeError('')
      setPasswordNewError('Minimo 8 caracteres con mayuscula, minuscula, numero y simbolo')
      setPasswordConfirmError('')
      setPasswordFormError('')
      setPasswordFormSuccess('')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordCodeError('')
      setPasswordNewError('')
      setPasswordConfirmError('Las contraseñas no coinciden')
      setPasswordFormError('')
      setPasswordFormSuccess('')
      return
    }

    setPasswordCodeError('')
    setPasswordNewError('')
    setPasswordConfirmError('')
    setPasswordFormError('')
    setPasswordFormSuccess('')
    setIsConfirmingPasswordChange(true)

    const result = await confirmPasswordChange(normalizedCode, newPassword)
    if (!result.success) {
      const backendError = 'error' in result ? result.error : 'No se pudo cambiar la contraseña'
      const normalizedError = String(backendError || '').toLowerCase()

      if (normalizedError.includes('la nueva contrasena no puede ser igual a la anterior')) {
        setPasswordNewError('Debes ingresar una contraseña diferente a la actual')
        setPasswordFormError('')
      } else {
        setPasswordFormError(backendError)
      }

      setIsConfirmingPasswordChange(false)
      return
    }

    setPasswordFormSuccess(result.message)
    setIsConfirmingPasswordChange(false)
    setHasRequestedPasswordChange(false)
    setPasswordCode('')
    setNewPassword('')
    setConfirmPassword('')
    await logout()
    navigate('/auth/login', { replace: true })
  }

  const handleEmailChangeRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedEmail = emailValue.trim().toLowerCase()
    if (!isValidEmail(normalizedEmail)) {
      setEmailFormError('Ingresa un email valido')
      setEmailFormSuccess('')
      return
    }

    if (normalizedEmail === account?.email?.toLowerCase()) {
      setEmailFormError('Ingresa un correo diferente al actual')
      setEmailFormSuccess('')
      return
    }

    setEmailFormError('')
    setEmailFormSuccess('')
    openSecurityModal(
      'request-email-change',
      'Confirmacion de seguridad',
      `Se enviara un codigo de verificacion al correo ${normalizedEmail}. Verifica que sea correcto antes de continuar.`,
      'Si, enviar codigo',
    )
  }

  const handleEmailChangeConfirm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedCode = emailCode.trim()
    if (!normalizedCode) {
      setEmailFormError('Ingresa el codigo enviado al nuevo correo')
      setEmailFormSuccess('')
      return
    }

    setEmailFormError('')
    setEmailFormSuccess('')
    openSecurityModal(
      'confirm-email-change',
      'Confirmacion de seguridad',
      'Estas a punto de actualizar el correo principal de tu cuenta. Asegurate de tener acceso al nuevo correo antes de continuar.',
      'Si, cambiar correo',
    )
  }

  const handlePasswordChangeRequest = () => {
    setPasswordCodeError('')
    setPasswordNewError('')
    setPasswordConfirmError('')
    setPasswordFormError('')
    setPasswordFormSuccess('')
    openSecurityModal(
      'request-password-change',
      'Confirmacion de seguridad',
      'Se enviara un codigo de seguridad a tu correo actual para autorizar el cambio de contraseña.',
      'Si, enviar codigo',
    )
  }

  const handlePasswordChangeConfirm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedCode = passwordCode.trim()
    if (!normalizedCode) {
      setPasswordCodeError('Ingresa el codigo enviado a tu correo actual')
      setPasswordNewError('')
      setPasswordConfirmError('')
      setPasswordFormError('')
      setPasswordFormSuccess('')
      return
    }

    if (!isValidPassword(newPassword)) {
      setPasswordCodeError('')
      setPasswordNewError('Minimo 8 caracteres con mayuscula, minuscula, numero y simbolo')
      setPasswordConfirmError('')
      setPasswordFormError('')
      setPasswordFormSuccess('')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordCodeError('')
      setPasswordNewError('')
      setPasswordConfirmError('Las contraseñas no coinciden')
      setPasswordFormError('')
      setPasswordFormSuccess('')
      return
    }

    setPasswordCodeError('')
    setPasswordNewError('')
    setPasswordConfirmError('')
    setPasswordFormError('')
    setPasswordFormSuccess('')
    openSecurityModal(
      'confirm-password-change',
      'Confirmacion de seguridad',
      'Estas a punto de reemplazar la contraseña de acceso de tu cuenta. Confirma solo si reconoces esta operacion.',
      'Si, cambiar contraseña',
    )
  }

  const handleSecurityConfirmation = async () => {
    const { action } = securityModalState
    closeSecurityModal()

    if (action === 'request-email-change') {
      await requestEmailChangeAction()
      return
    }

    if (action === 'confirm-email-change') {
      await confirmEmailChangeAction()
      return
    }

    if (action === 'request-password-change') {
      await requestPasswordChangeAction()
      return
    }

    if (action === 'confirm-password-change') {
      await confirmPasswordChangeAction()
    }
  }

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <Navbar />

      <main className='relative overflow-hidden px-4 pb-16 pt-24'>
        <div className='pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.14),transparent_55%),radial-gradient(circle_at_right,rgba(34,211,238,0.12),transparent_35%)]' />

        <div className='relative mx-auto max-w-6xl'>
          <section className='rounded-4xl border border-border bg-card/90 p-8 shadow-sm backdrop-blur md:p-10'>
            <div className='flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between'>
              <div className='max-w-2xl'>
                <span className='inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-2 text-sm font-medium text-primary'>
                  <ShieldCheck className='h-4 w-4' />
                  Area privada autenticada
                </span>
                <h1 className='mt-5 text-4xl font-bold tracking-tight text-foreground md:text-5xl'>
                  Configuracion de tu cuenta
                </h1>
                <p className='mt-4 text-base leading-7 text-muted-foreground md:text-lg'>
                  Aqui centralizamos la informacion basica de tu usuario y las acciones de seguridad de la cuenta.
                  Desde esta vista puedes consultar el correo actual y gestionar los cambios de correo y contraseña
                  mediante codigos de verificacion.
                </p>
              </div>

              <div className='grid gap-3 rounded-3xl border border-border bg-background/90 p-5 shadow-sm sm:grid-cols-2 lg:min-w-[320px]'>
                <div>
                  <p className='text-xs uppercase tracking-[0.24em] text-muted-foreground'>Usuario</p>
                  <p className='mt-2 text-lg font-semibold text-foreground'>#{account?.userId ?? id}</p>
                </div>
                <div>
                  <p className='text-xs uppercase tracking-[0.24em] text-muted-foreground'>Sesion</p>
                  <p className='mt-2 inline-flex items-center gap-2 text-sm font-medium text-foreground'>
                    <Sparkles className='h-4 w-4 text-secondary' />
                    {user?.name || 'Usuario autenticado'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className='mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]'>
            <article className='rounded-4xl border border-border bg-card p-7 shadow-sm md:p-8'>
              <div className='flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <p className='text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground'>
                    Datos de acceso
                  </p>
                  <h2 className='mt-3 text-2xl font-semibold text-foreground'>Correo de la cuenta</h2>
                </div>

                <Button
                  type='button'
                  variant='outline'
                  onClick={handleRefreshAccount}
                  disabled={isLoading}
                >
                  <RefreshCcw className='h-4 w-4' />
                  {isLoading ? 'Cargando...' : 'Actualizar'}
                </Button>
              </div>

              {error ? (
                <div className='mt-6 rounded-3xl border border-destructive/20 bg-destructive/5 p-5'>
                  <p className='text-sm font-medium text-destructive'>{error}</p>
                  <p className='mt-2 text-sm text-muted-foreground'>
                    Verifica que el usuario exista y que tu token siga activo.
                  </p>
                </div>
              ) : null}

              <div className='mt-6 rounded-[1.75rem] border border-border bg-background p-6 shadow-sm'>
                <div className='flex items-start gap-4'>
                  <span className='inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary/15 text-secondary-foreground'>
                    <Mail className='h-6 w-6 text-secondary-foreground' />
                  </span>

                  <div className='min-w-0 flex-1'>
                    <p className='text-sm font-medium text-muted-foreground'>Correo actual</p>
                    {isLoading ? (
                      <>
                        <div className='mt-3 h-5 w-40 animate-pulse rounded-full bg-muted' />
                        <div className='mt-2 h-4 w-28 animate-pulse rounded-full bg-muted' />
                      </>
                    ) : (
                      <>
                        <p className='mt-3 break-all text-xl font-semibold text-foreground'>
                          {account?.email || 'Sin correo disponible'}
                        </p>
                        <p className='mt-2 text-sm text-muted-foreground'>
                          Este es el correo principal asociado a tu cuenta para accesos y verificaciones.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className='mt-6 flex flex-wrap gap-3'>
                <Link
                  to={user ? `/profile/${user.id}` : '/profile'}
                  className='inline-flex h-11 cursor-pointer items-center justify-center rounded-xl border border-border bg-background px-5 font-medium text-foreground transition-colors hover:bg-accent'
                >
                  Ver mi perfil
                </Link>
              </div>

              <div className='mt-8 rounded-[1.75rem] border border-border bg-background/80 p-6 shadow-sm'>
                <div className='flex flex-col gap-2 border-b border-border pb-5'>
                  <p className='text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground'>
                    Informacion actual de la cuenta
                  </p>
                  <p className='text-sm leading-6 text-muted-foreground'>
                    {isRecruiterAccount
                      ? 'Resumen de los datos principales asociados a tu cuenta de reclutador y a la empresa registrada.'
                      : 'Resumen de los datos principales asociados a tu usuario.'}
                  </p>
                </div>

                {isLoading ? (
                  <div className='mt-5 grid gap-3 sm:grid-cols-2'>
                    <div className='h-24 animate-pulse rounded-2xl bg-muted' />
                    <div className='h-24 animate-pulse rounded-2xl bg-muted' />
                    <div className='h-24 animate-pulse rounded-2xl bg-muted' />
                    <div className='h-24 animate-pulse rounded-2xl bg-muted' />
                  </div>
                ) : (
                  <div className='mt-5 grid gap-3 sm:grid-cols-2'>
                    <div className='rounded-2xl border border-border bg-card px-4 py-4'>
                      <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>
                        {isRecruiterAccount ? 'Nombre visible' : 'Nombre completo'}
                      </p>
                      <p className='mt-2 text-base font-semibold text-foreground'>
                        {account?.fullName || 'Sin nombre registrado'}
                      </p>
                    </div>

                    <div className='rounded-2xl border border-border bg-card px-4 py-4'>
                      <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>Tipo de usuario</p>
                      <p className='mt-2 text-base font-semibold text-foreground'>
                        {account?.userType || 'Sin tipo disponible'}
                      </p>
                    </div>

                    {isRecruiterAccount ? (
                      <>
                        <div className='rounded-2xl border border-border bg-card px-4 py-4'>
                          <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>Empresa</p>
                          <p className='mt-2 text-base font-semibold text-foreground'>
                            {account?.companyName || 'Sin empresa registrada'}
                          </p>
                        </div>

                        <div className='rounded-2xl border border-border bg-card px-4 py-4'>
                          <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>Industria</p>
                          <p className='mt-2 text-base font-semibold text-foreground'>
                            {account?.industry || 'Sin industria registrada'}
                          </p>
                        </div>

                        <div className='rounded-2xl border border-border bg-card px-4 py-4'>
                          <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>Contacto principal</p>
                          <p className='mt-2 text-base font-semibold text-foreground'>
                            {[account?.contactFirstName, account?.contactLastName].filter(Boolean).join(' ') || 'Sin contacto registrado'}
                          </p>
                        </div>

                        <div className='rounded-2xl border border-border bg-card px-4 py-4'>
                          <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>Tamaño de empresa</p>
                          <p className='mt-2 text-base font-semibold text-foreground'>
                            {typeof account?.companySize === 'number' ? `${account.companySize} empleados` : 'Sin dato'}
                          </p>
                        </div>

                        <div className='rounded-2xl border border-border bg-card px-4 py-4'>
                          <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>NIT</p>
                          <p className='mt-2 text-base font-semibold text-foreground'>
                            {account?.nit ?? 'Sin NIT registrado'}
                          </p>
                        </div>

                        <div className='rounded-2xl border border-border bg-card px-4 py-4'>
                          <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>Sitio web</p>
                          <p className='mt-2 break-all text-base font-semibold text-foreground'>
                            {account?.websiteUrl || 'Sin sitio web registrado'}
                          </p>
                        </div>

                        <div className='rounded-2xl border border-border bg-card px-4 py-4'>
                          <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>Pais</p>
                          <p className='mt-2 text-base font-semibold text-foreground'>
                            {account?.countryId || 'Sin pais definido'}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className='rounded-2xl border border-border bg-card px-4 py-4'>
                          <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>Nombre</p>
                          <p className='mt-2 text-base font-semibold text-foreground'>
                            {account?.firstName || 'Sin dato'}
                          </p>
                        </div>

                        <div className='rounded-2xl border border-border bg-card px-4 py-4'>
                          <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>Apellido</p>
                          <p className='mt-2 text-base font-semibold text-foreground'>
                            {account?.lastName || 'Sin dato'}
                          </p>
                        </div>

                        <div className='rounded-2xl border border-border bg-card px-4 py-4'>
                          <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>Usuario visible</p>
                          <p className='mt-2 text-base font-semibold text-foreground'>
                            {account?.username || 'Sin username'}
                          </p>
                        </div>

                        <div className='rounded-2xl border border-border bg-card px-4 py-4'>
                          <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>Titulo profesional</p>
                          <p className='mt-2 text-base font-semibold text-foreground'>
                            {account?.professionalTitle || 'Sin titulo registrado'}
                          </p>
                        </div>

                        <div className='rounded-2xl border border-border bg-card px-4 py-4'>
                          <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>Pais</p>
                          <p className='mt-2 text-base font-semibold text-foreground'>
                            {account?.countryId || 'Sin pais definido'}
                          </p>
                        </div>

                        <div className='rounded-2xl border border-border bg-card px-4 py-4'>
                          <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>Proveedor de acceso</p>
                          <p className='mt-2 text-base font-semibold text-foreground'>
                            {account?.authProvider || 'Sin proveedor disponible'}
                          </p>
                        </div>

                        <div className='rounded-2xl border border-border bg-card px-4 py-4 sm:col-span-2'>
                          <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>Cuenta creada</p>
                          <p className='mt-2 text-base font-semibold text-foreground'>
                            {formatAccountDate(account?.createdAt)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </article>

            <div>
              <SecurityCard
                icon={activeSecurityTab === 'email' ? <Mail className='h-5 w-5' /> : <KeyRound className='h-5 w-5' />}
                title={activeSecurityTab === 'email' ? 'Cambiar correo' : 'Cambiar contraseña'}
                description={
                  activeSecurityTab === 'email'
                    ? 'Solicita un codigo al nuevo correo, ingresa ese codigo y confirma el cambio.'
                    : 'Solicita un codigo a tu correo actual y luego confirma la nueva contraseña.'
                }
              >
                <div className='rounded-2xl border border-border bg-background/80 p-1'>
                  <div className='grid grid-cols-2 gap-1'>
                    <button
                      type='button'
                      onClick={() => setActiveSecurityTab('email')}
                      className={`cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                        activeSecurityTab === 'email'
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      }`}
                    >
                      Correo
                    </button>
                    <button
                      type='button'
                      onClick={() => setActiveSecurityTab('password')}
                      className={`cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                        activeSecurityTab === 'password'
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      }`}
                    >
                      Contraseña
                    </button>
                  </div>
                </div>

                {activeSecurityTab === 'email' ? (
                  <>
                    <form className='mt-5 space-y-4' onSubmit={handleEmailChangeRequest}>
                      <div>
                        <label htmlFor='newEmail' className='mb-2 block text-sm font-medium text-foreground'>
                          Nuevo correo
                        </label>
                        <Input
                          id='newEmail'
                          type='email'
                          placeholder='Introduce el nuevo correo'
                          value={emailValue}
                          onChange={(event) => {
                            setEmailValue(event.target.value)
                            setEmailFormError('')
                          }}
                        />
                      </div>

                      <Button type='submit' className='w-full cursor-pointer' disabled={isRequestingEmailChange}>
                        {isRequestingEmailChange ? 'Enviando codigo...' : 'Enviar codigo al nuevo correo'}
                      </Button>
                    </form>

                    {hasRequestedEmailChange ? (
                      <form className='mt-5 space-y-4 border-t border-border pt-5' onSubmit={handleEmailChangeConfirm}>
                        <div>
                          <label htmlFor='emailCode' className='mb-2 block text-sm font-medium text-foreground'>
                            Codigo de verificacion
                          </label>
                          <Input
                            id='emailCode'
                            placeholder='123456'
                            value={emailCode}
                            onChange={(event) => {
                              setEmailCode(event.target.value)
                              setEmailFormError('')
                            }}
                          />
                        </div>

                        <Button type='submit' variant='outline' className='w-full cursor-pointer' disabled={isConfirmingEmailChange}>
                          {isConfirmingEmailChange ? 'Confirmando...' : 'Confirmar cambio de correo'}
                        </Button>
                      </form>
                    ) : null}

                    {emailFormError ? <p className='mt-4 text-sm text-destructive'>{emailFormError}</p> : null}
                    {emailFormSuccess ? (
                      <p className='mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>
                        {emailFormSuccess}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <>
                    <Button
                      type='button'
                      className='mt-5 w-full cursor-pointer'
                      onClick={handlePasswordChangeRequest}
                      disabled={isRequestingPasswordChange}
                    >
                      {isRequestingPasswordChange ? 'Enviando codigo...' : 'Enviar codigo a mi correo actual'}
                    </Button>

                    {hasRequestedPasswordChange ? (
                      <form className='mt-5 space-y-4 border-t border-border pt-5' onSubmit={handlePasswordChangeConfirm}>
                        <div>
                          <label htmlFor='passwordCode' className='mb-2 block text-sm font-medium text-foreground'>
                            Codigo de verificacion
                          </label>
                          <Input
                            id='passwordCode'
                            placeholder='123456'
                            value={passwordCode}
                            onChange={(event) => {
                              setPasswordCode(event.target.value)
                              setPasswordCodeError('')
                              setPasswordFormError('')
                            }}
                            className={passwordCodeError ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}
                            aria-invalid={Boolean(passwordCodeError)}
                          />
                          <p className='mt-2 min-h-5 text-sm text-destructive'>{passwordCodeError || ' '}</p>
                        </div>

                        <div>
                          <label htmlFor='newPassword' className='mb-2 block text-sm font-medium text-foreground'>
                            Nueva contraseña
                          </label>
                          <Input
                            id='newPassword'
                            type='password'
                            placeholder='NuevaClave123@'
                            value={newPassword}
                            onChange={(event) => {
                              setNewPassword(event.target.value)
                              setPasswordNewError('')
                              setPasswordFormError('')
                            }}
                            className={passwordNewError ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}
                            aria-invalid={Boolean(passwordNewError)}
                          />
                          <p className='mt-2 min-h-5 text-sm text-destructive'>{passwordNewError || ' '}</p>
                        </div>

                        <div>
                          <label htmlFor='confirmPassword' className='mb-2 block text-sm font-medium text-foreground'>
                            Confirmar contraseña
                          </label>
                          <Input
                            id='confirmPassword'
                            type='password'
                            placeholder='Repite la nueva contraseña'
                            value={confirmPassword}
                            onChange={(event) => {
                              setConfirmPassword(event.target.value)
                              setPasswordConfirmError('')
                              setPasswordFormError('')
                            }}
                            className={passwordConfirmError ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}
                            aria-invalid={Boolean(passwordConfirmError)}
                          />
                          <p className='mt-2 min-h-5 text-sm text-destructive'>{passwordConfirmError || ' '}</p>
                        </div>

                        <Button type='submit' variant='outline' className='w-full cursor-pointer' disabled={isConfirmingPasswordChange}>
                          {isConfirmingPasswordChange ? 'Actualizando...' : 'Confirmar cambio de contraseña'}
                        </Button>
                      </form>
                    ) : null}

                    {passwordFormError ? <p className='mt-4 text-sm text-destructive'>{passwordFormError}</p> : null}
                    {passwordFormSuccess ? (
                      <p className='mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>
                        {passwordFormSuccess}
                      </p>
                    ) : null}
                  </>
                )}
              </SecurityCard>
            </div>
          </section>
        </div>
      </main>

      <Modal open={securityModalState.open} onClose={closeSecurityModal} title={securityModalState.title}>
        <div className='space-y-5'>
          <div className='rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800'>
            Esta accion afecta la seguridad de tu cuenta.
          </div>

          <p className='text-sm leading-6 text-muted-foreground'>{securityModalState.description}</p>

          <div className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
            <Button type='button' variant='outline' className='cursor-pointer' onClick={closeSecurityModal}>
              Cancelar
            </Button>
            <Button type='button' className='cursor-pointer' onClick={handleSecurityConfirmation}>
              {securityModalState.confirmLabel}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
