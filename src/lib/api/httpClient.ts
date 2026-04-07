type ErrorPayload = Record<string, unknown>

function isObject(value: unknown): value is ErrorPayload {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getMessage(payload: unknown): string | null {
  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }

  if (!isObject(payload)) {
    return null
  }

  const directMessageKeys = ['message', 'error', 'detail', 'title']

  for (const key of directMessageKeys) {
    const value = payload[key]
    if (typeof value === 'string' && value.trim()) {
      return value
    }
  }

  if (isObject(payload.data)) {
    return getMessage(payload.data)
  }

  return null
}

export class HttpClientError extends Error {
  status: number
  payload: unknown

  constructor(status: number, payload: unknown) {
    super(getMessage(payload) || `HTTP ${status}`)
    this.name = 'HttpClientError'
    this.status = status
    this.payload = payload
  }
}

export async function httpClient<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {})

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  const responseText = await response.text()
  let payload: unknown = null

  if (responseText) {
    try {
      payload = JSON.parse(responseText)
    } catch {
      payload = responseText
    }
  }

  if (!response.ok) {
    throw new HttpClientError(response.status, payload)
  }

  return payload as T
}

export default httpClient
