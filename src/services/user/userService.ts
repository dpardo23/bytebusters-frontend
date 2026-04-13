import { AUTH_TOKEN_STORAGE_KEY } from '../../store/auth/authStore'
import type { UserAccount } from '../../types/user.types'

const API_BASE_URL = String(import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')

type BackendApiResponse<T> = {
  success?: boolean
  status?: number
  message?: string
  data?: T
  errors?: string[]
}

type MessageResult =
  | {
      success: true
      message: string
    }
  | {
      success: false
      error: string
    }

function resolveErrorMessage(payload: BackendApiResponse<unknown> | null, fallback: string): string {
  if (payload?.errors?.length) {
    return payload.errors[0]
  }

  if (payload?.message) {
    return payload.message
  }

  return fallback
}

function isUserAccount(value: unknown): value is UserAccount {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<UserAccount>
  return (
    typeof candidate.userId === 'number' &&
    typeof candidate.email === 'string' &&
    typeof candidate.userType === 'string' &&
    typeof candidate.firstName === 'string' &&
    typeof candidate.lastName === 'string' &&
    typeof candidate.fullName === 'string' &&
    typeof candidate.username === 'string' &&
    typeof candidate.countryId === 'string' &&
    typeof candidate.authProvider === 'string' &&
    typeof candidate.createdAt === 'string'
  )
}

function getAuthTokenOrThrow(): string {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  if (!token) {
    throw new Error('Tu sesion expiro. Inicia sesion nuevamente.')
  }

  return token
}

function isWrappedResponse<T>(value: unknown): value is BackendApiResponse<T> {
  return Boolean(value) && typeof value === 'object' && ('message' in (value as object) || 'data' in (value as object) || 'errors' in (value as object) || 'success' in (value as object))
}

function isFailureResponse<T>(response: Response, payload: BackendApiResponse<T> | T | null): boolean {
  if (!response.ok) {
    return true
  }

  if (!isWrappedResponse(payload)) {
    return false
  }

  if (payload.success === false) {
    return true
  }

  if (typeof payload.status === 'number' && payload.status >= 400) {
    return true
  }

  return false
}

async function performAuthenticatedRequest<T>(
  path: string,
  options: {
    method: 'GET' | 'POST'
    body?: Record<string, unknown>
  },
): Promise<{ response: Response; payload: BackendApiResponse<T> | T | null }> {
  const token = getAuthTokenOrThrow()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      Authorization: `Bearer ${token}`,
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  })

  const payload = (await response.json().catch(() => null)) as BackendApiResponse<T> | T | null
  return { response, payload }
}

function resolveSuccessMessage(payload: BackendApiResponse<unknown> | null, fallback: string): string {
  if (payload?.message) {
    return payload.message
  }

  if (payload?.data && typeof payload.data === 'object' && 'message' in payload.data) {
    const nestedMessage = (payload.data as { message?: string }).message
    if (nestedMessage) {
      return nestedMessage
    }
  }

  return fallback
}

export async function fetchUserAccount(userId: string): Promise<UserAccount> {
  const { response, payload } = await performAuthenticatedRequest<UserAccount>(`/api/user/${userId}`, {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error(
      resolveErrorMessage(
        isWrappedResponse(payload) ? payload : null,
        'No se pudo cargar la informacion del usuario',
      ),
    )
  }

  if (isUserAccount(payload)) {
    return payload
  }

  if (isWrappedResponse(payload) && isUserAccount(payload.data)) {
    return payload.data
  }

  throw new Error('La respuesta del servidor no tiene el formato esperado')
}

export async function requestEmailChange(newEmail: string): Promise<MessageResult> {
  try {
    const { response, payload } = await performAuthenticatedRequest<unknown>('/api/user/email-change/request', {
      method: 'POST',
      body: { newEmail },
    })

    if (isFailureResponse(response, payload)) {
      return {
        success: false,
        error: resolveErrorMessage(isWrappedResponse(payload) ? payload : null, 'No se pudo enviar el codigo'),
      }
    }

    return {
      success: true,
      message: resolveSuccessMessage(isWrappedResponse(payload) ? payload : null, 'Codigo enviado correctamente'),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'No se pudo conectar con el servidor',
    }
  }
}

export async function confirmEmailChange(code: string): Promise<MessageResult> {
  try {
    const { response, payload } = await performAuthenticatedRequest<unknown>('/api/user/email-change/confirm', {
      method: 'POST',
      body: { code },
    })

    if (isFailureResponse(response, payload)) {
      return {
        success: false,
        error: resolveErrorMessage(isWrappedResponse(payload) ? payload : null, 'No se pudo cambiar el correo'),
      }
    }

    return {
      success: true,
      message: resolveSuccessMessage(isWrappedResponse(payload) ? payload : null, 'Correo actualizado correctamente'),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'No se pudo conectar con el servidor',
    }
  }
}

export async function requestPasswordChange(): Promise<MessageResult> {
  try {
    const { response, payload } = await performAuthenticatedRequest<unknown>('/api/user/password-change/request', {
      method: 'POST',
    })

    if (isFailureResponse(response, payload)) {
      return {
        success: false,
        error: resolveErrorMessage(isWrappedResponse(payload) ? payload : null, 'No se pudo enviar el codigo'),
      }
    }

    return {
      success: true,
      message: resolveSuccessMessage(isWrappedResponse(payload) ? payload : null, 'Codigo enviado correctamente'),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'No se pudo conectar con el servidor',
    }
  }
}

export async function confirmPasswordChange(code: string, newPassword: string): Promise<MessageResult> {
  try {
    const { response, payload } = await performAuthenticatedRequest<unknown>('/api/user/password-change/confirm', {
      method: 'POST',
      body: { code, newPassword },
    })

    if (isFailureResponse(response, payload)) {
      return {
        success: false,
        error: resolveErrorMessage(isWrappedResponse(payload) ? payload : null, 'No se pudo cambiar la contrasena'),
      }
    }

    return {
      success: true,
      message: resolveSuccessMessage(isWrappedResponse(payload) ? payload : null, 'Contrasena actualizada correctamente'),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'No se pudo conectar con el servidor',
    }
  }
}
