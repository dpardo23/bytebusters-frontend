import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { markRegisteredUser, setAuthenticatedUser } from '../../store/auth/authStore'
import type { AuthRole, AuthUser } from '../../types/auth.types'

type OAuthCallbackParams = {
  token: string
  tokenType?: string | null
  expiresIn?: string | null
  action?: string | null
  error?: string | null
}

type JwtPayload = {
  userId?: number
  username?: string
  email?: string
  userType?: 'LOCAL' | 'GOOGLE' | 'GITHUB' | 'INVITADO' | 'ESTANDAR' | 'RECLUTADOR' | 'ADMINISTRADOR'
}

const OAUTH_INTENT_KEY = 'oauth_intent'

function mapRole(userType?: JwtPayload['userType']): AuthRole {
  switch (userType) {
    case 'RECLUTADOR':
      return 'recruiter'
    case 'ADMINISTRADOR':
      return 'admin'
    case 'ESTANDAR':
      return 'basic'
    default:
      return 'basic'
  }
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payloadPart = token.split('.')[1]
    if (!payloadPart) return null

    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const decoded = atob(padded)
    return JSON.parse(decoded) as JwtPayload
  } catch {
    return null
  }
}

function readOAuthCallbackParams(): OAuthCallbackParams | null {
  const fragment = window.location.hash.replace(/^#/, '')
  if (!fragment) return null

  const searchParams = new URLSearchParams(fragment)
  const token = searchParams.get('token')
  if (!token) return null

  return {
    token,
    tokenType: searchParams.get('tokenType'),
    expiresIn: searchParams.get('expiresIn'),
    action: searchParams.get('action'),
    error: searchParams.get('error'),
  }
}

function consumeOAuthIntent(): 'login' | 'register' | null {
  const intent = sessionStorage.getItem(OAUTH_INTENT_KEY)
  sessionStorage.removeItem(OAUTH_INTENT_KEY)

  if (intent === 'login' || intent === 'register') {
    return intent
  }

  return null
}

function toTitleCase(value: string): string {
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

function buildOAuthDisplayName(username?: string, email?: string): string {
  const candidate = (username || email?.split('@')[0] || '').trim()
  const lettersAndSpaces = candidate
    .replace(/[._-]+/g, ' ')
    .replace(/[^A-Za-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (lettersAndSpaces) {
    return toTitleCase(lettersAndSpaces)
  }

  return 'Usuario'
}

export default function OAuthCallbackPage() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Procesando tu acceso...')
  const [hasError, setHasError] = useState(false)

  const callbackData = useMemo(() => readOAuthCallbackParams(), [])

  useEffect(() => {
    if (!callbackData) {
      const errorInHash = new URLSearchParams(window.location.hash.replace(/^#/, '')).get('error')
      if (errorInHash) {
        setHasError(true)
        setMessage(errorInHash)
        return
      }

      setHasError(true)
      setMessage('No se pudo completar el inicio de sesion. Intenta de nuevo.')
      return
    }

    if (callbackData.error) {
      setHasError(true)
      setMessage(callbackData.error)
      return
    }

    const payload = decodeJwtPayload(callbackData.token)
    if (!payload?.userId || !payload.email) {
      setHasError(true)
      setMessage('La respuesta de autenticacion no fue valida.')
      return
    }

    const nextUser: AuthUser = {
      id: String(payload.userId),
      email: payload.email,
      name: buildOAuthDisplayName(payload.username, payload.email),
      role: mapRole(payload.userType),
      createdAt: new Date().toISOString(),
    }

    markRegisteredUser()
    setAuthenticatedUser(nextUser, callbackData.token)

    const oauthIntent = consumeOAuthIntent()
    const isRegisterAction = callbackData.action?.toUpperCase() === 'REGISTER'
    const shouldGoToOnboarding = oauthIntent === 'register' || (oauthIntent === null && isRegisterAction)
    const targetPath = shouldGoToOnboarding ? '/profile' : `/user/${payload.userId}`

    setMessage('Acceso completado. Redirigiendo...')
    window.setTimeout(() => {
      navigate(targetPath, { replace: true })
    }, 700)
  }, [callbackData, navigate])

  return (
    <section className='flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10'>
      <div className='w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-sm'>
        <div className='mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm'>
          <span className='h-3 w-3 animate-pulse rounded-full bg-current' />
        </div>
        <h1 className='text-2xl font-bold text-foreground'>Autenticando</h1>
        <p className={`mt-3 text-sm ${hasError ? 'text-destructive' : 'text-muted-foreground'}`}>{message}</p>
      </div>
    </section>
  )
}
