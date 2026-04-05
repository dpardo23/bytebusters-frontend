export function isValidEmail(email) {
  return /.+@.+\..+/.test(email)
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6
}

export function getRegisterFieldError(field, values) {
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

export function getRegisterFieldErrors({ name, email, password, confirmPassword }) {
  const fieldErrors = {}

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