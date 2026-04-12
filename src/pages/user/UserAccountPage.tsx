import { KeyRound, Mail, RefreshCcw, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import useAuth from '../../hooks/auth/useAuth'
import { isValidEmail, isValidPassword } from '../../lib/validations/authValidations'
import {
  confirmEmailChange,
  confirmPasswordChange,
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

export default function UserAccountPage() {
  const { id } = useParams()
  const { user, updateUserDetails } = useAuth()
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
  const [passwordFormError, setPasswordFormError] = useState('')
  const [passwordFormSuccess, setPasswordFormSuccess] = useState('')
  const [hasRequestedPasswordChange, setHasRequestedPasswordChange] = useState(false)
  const [isRequestingPasswordChange, setIsRequestingPasswordChange] = useState(false)
  const [isConfirmingPasswordChange, setIsConfirmingPasswordChange] = useState(false)

  async function loadUserAccount(nextUserId: string) {
    setIsLoading(true)
    setError('')

    try {
      const nextAccount = await fetchUserAccount(nextUserId)
      setAccount(nextAccount)
      setEmailValue(nextAccount.email)
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
        const nextAccount = await fetchUserAccount(id)
        if (!isMounted) {
          return
        }

        setAccount(nextAccount)
        setEmailValue(nextAccount.email)
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
  }, [id])

  if (!id) {
    return <Navigate to='/' replace />
  }

  const handleRefreshAccount = async () => {
    await loadUserAccount(id)
  }

  const handleEmailChangeRequest = async (event: FormEvent<HTMLFormElement>) => {
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

  const handleEmailChangeConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

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
    await loadUserAccount(id)
    updateUserDetails({ email: emailValue.trim().toLowerCase() })
  }

  const handlePasswordChangeRequest = async () => {
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

  const handlePasswordChangeConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedCode = passwordCode.trim()
    if (!normalizedCode) {
      setPasswordFormError('Ingresa el codigo enviado a tu correo actual')
      setPasswordFormSuccess('')
      return
    }

    if (!isValidPassword(newPassword)) {
      setPasswordFormError('Minimo 8 caracteres con mayuscula, minuscula, numero y simbolo')
      setPasswordFormSuccess('')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordFormError('Las contraseñas no coinciden')
      setPasswordFormSuccess('')
      return
    }

    setPasswordFormError('')
    setPasswordFormSuccess('')
    setIsConfirmingPasswordChange(true)

    const result = await confirmPasswordChange(normalizedCode, newPassword)
    if (!result.success) {
      setPasswordFormError('error' in result ? result.error : 'No se pudo cambiar la contraseña')
      setIsConfirmingPasswordChange(false)
      return
    }

    setPasswordFormSuccess(result.message)
    setIsConfirmingPasswordChange(false)
    setHasRequestedPasswordChange(false)
    setPasswordCode('')
    setNewPassword('')
    setConfirmPassword('')
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
                          Este dato viene del endpoint protegido `GET /api/user/{id}`.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className='mt-6 flex flex-wrap gap-3'>
                <Link
                  to={user ? `/profile/${user.id}` : '/profile'}
                  className='inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-5 font-medium text-foreground transition-colors hover:bg-accent'
                >
                  Ver mi perfil
                </Link>
              </div>
            </article>

            <div className='grid gap-6'>
              <SecurityCard
                icon={<Mail className='h-5 w-5' />}
                title='Cambiar correo'
                description='Solicita un codigo al nuevo correo, ingresa ese codigo y confirma el cambio.'
              >
                <form className='space-y-4' onSubmit={handleEmailChangeRequest}>
                  <div>
                    <label htmlFor='newEmail' className='mb-2 block text-sm font-medium text-foreground'>
                      Nuevo correo
                    </label>
                    <Input
                      id='newEmail'
                      type='email'
                      placeholder='nuevo@email.com'
                      value={emailValue}
                      onChange={(event) => {
                        setEmailValue(event.target.value)
                        setEmailFormError('')
                      }}
                    />
                  </div>

                  <Button type='submit' className='w-full' disabled={isRequestingEmailChange}>
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

                    <Button type='submit' variant='outline' className='w-full' disabled={isConfirmingEmailChange}>
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
              </SecurityCard>
              <SecurityCard
                icon={<KeyRound className='h-5 w-5' />}
                title='Cambiar contraseña'
                description='Solicita un codigo a tu correo actual y luego confirma la nueva contraseña.'
              >
                <Button type='button' className='w-full' onClick={handlePasswordChangeRequest} disabled={isRequestingPasswordChange}>
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
                          setPasswordFormError('')
                        }}
                      />
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
                          setPasswordFormError('')
                        }}
                      />
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
                          setPasswordFormError('')
                        }}
                      />
                    </div>

                    <Button type='submit' variant='outline' className='w-full' disabled={isConfirmingPasswordChange}>
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
              </SecurityCard>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
