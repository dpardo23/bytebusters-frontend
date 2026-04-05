export function isValidEmail(email) {
  return /.+@.+\..+/.test(email)
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6
}