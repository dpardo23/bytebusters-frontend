import type { RegisterAccountData } from '../../types/auth.types'

export type LoginField = 'email' | 'password'

export type LoginValues = {
  email: string
  password: string
}

export type RegisterField = 'name' | 'email' | 'password' | 'confirmPassword'

export type RegisterValues = Pick<RegisterAccountData, 'name' | 'email' | 'password'> & {
  confirmPassword: string
}

export function isValidEmail(email: string): boolean {
  return /.+@.+\..+/.test(email)
}

export function isValidPassword(password: string): boolean {
  return typeof password === 'string' && password.length >= 6
}

export function getLoginFieldError(field: LoginField, values: LoginValues): string {
  const { email, password } = values

  if (field === 'email') {
    return isValidEmail(email) ? '' : 'Ingresa un email valido'
  }

  if (field === 'password') {
    return isValidPassword(password) ? '' : 'La contrasena debe tener al menos 6 caracteres'
  }

  return ''
}

export function getRegisterFieldError(field: RegisterField, values: RegisterValues): string {
  const { name, email, password, confirmPassword } = values

  if (field === 'name') {
    return name.trim() ? '' : 'Ingresa tu nombre completo'
  }

  if (field === 'email') {
    return isValidEmail(email) ? '' : 'Ingresa un email valido'
  }

  if (field === 'password') {
    return isValidPassword(password) ? '' : 'La contrasena debe tener al menos 6 caracteres'
  }

  if (field === 'confirmPassword') {
    if (!confirmPassword) {
      return 'Confirma tu contrasena'
    }

    return password === confirmPassword ? '' : 'Las contrasenas no coinciden'
  }

  return ''
}

export function getRegisterFieldErrors({ name, email, password, confirmPassword }: RegisterValues) {
  const fieldErrors: Partial<Record<RegisterField, string>> = {}

  if (!name.trim()) {
    fieldErrors.name = 'Ingresa tu nombre completo'
  }

  if (!isValidEmail(email)) {
    fieldErrors.email = 'Ingresa un email valido'
  }

  if (!isValidPassword(password)) {
    fieldErrors.password = 'La contrasena debe tener al menos 6 caracteres'
  }

  if (password !== confirmPassword) {
    fieldErrors.confirmPassword = 'Las contrasenas no coinciden'
  }

  return fieldErrors
}
