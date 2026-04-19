export type MockAuthRole = 'basic' | 'professional' | 'recruiter' | 'admin' | 'guest'

export interface MockAuthAccount {
  id: string
  name: string
  email: string
  password: string
  role: MockAuthRole
  createdAt: string
}

const MOCK_AUTH_STORAGE_KEY = 'ethoshub-mock-accounts'

function normalizeEmail(email: string): string {
  return String(email || '').trim().toLowerCase()
}

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

export function getMockAccounts(): MockAuthAccount[] {
  if (!canUseStorage()) {
    return []
  }

  try {
    const raw = localStorage.getItem(MOCK_AUTH_STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed as MockAuthAccount[]
  } catch {
    return []
  }
}

function saveMockAccounts(accounts: MockAuthAccount[]): void {
  if (!canUseStorage()) {
    return
  }

  localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(accounts))
}

function createMockId(): string {
  return `mock_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function ensureMockSeedAccount(): void {
  const accounts = getMockAccounts()
  const alreadyExists = accounts.some((account) => normalizeEmail(account.email) === 'demo@ethoshub.com')

  if (alreadyExists) {
    return
  }

  accounts.push({
    id: createMockId(),
    name: 'Demo EthosHub',
    email: 'demo@ethoshub.com',
    password: 'demo123',
    role: 'professional',
    createdAt: new Date().toISOString(),
  })

  saveMockAccounts(accounts)
}

export function registerMockAccount(data: {
  name: string
  email: string
  password: string
  role?: MockAuthRole
}): { success: true; account: MockAuthAccount } | { success: false; error: string } {
  const normalizedEmail = normalizeEmail(data.email)
  const accounts = getMockAccounts()

  const alreadyExists = accounts.some((account) => normalizeEmail(account.email) === normalizedEmail)
  if (alreadyExists) {
    return { success: false, error: 'Este email ya esta registrado' }
  }

  const account: MockAuthAccount = {
    id: createMockId(),
    name: String(data.name || '').trim() || 'Usuario EthosHub',
    email: normalizedEmail,
    password: String(data.password || ''),
    role: data.role || 'basic',
    createdAt: new Date().toISOString(),
  }

  accounts.push(account)
  saveMockAccounts(accounts)
  return { success: true, account }
}

export function authenticateMockAccount(email: string, password: string): MockAuthAccount | null {
  const normalizedEmail = normalizeEmail(email)
  const normalizedPassword = String(password || '')
  const accounts = getMockAccounts()

  const account = accounts.find(
    (item) => normalizeEmail(item.email) === normalizedEmail && String(item.password) === normalizedPassword,
  )

  return account || null
}

export function updateMockAccountRole(
  email: string,
  role: MockAuthRole,
): { success: true } | { success: false; error: string } {
  const normalizedEmail = normalizeEmail(email)
  const accounts = getMockAccounts()
  const accountIndex = accounts.findIndex((item) => normalizeEmail(item.email) === normalizedEmail)

  if (accountIndex === -1) {
    return { success: false, error: 'No se encontro una cuenta registrada para actualizar el rol' }
  }

  accounts[accountIndex] = {
    ...accounts[accountIndex],
    role,
  }

  saveMockAccounts(accounts)
  return { success: true }
}
