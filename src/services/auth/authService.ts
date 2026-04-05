export async function login(credentials) {
  return {
    success: true,
    credentials,
  }
}

export async function logout() {
  return { success: true }
}