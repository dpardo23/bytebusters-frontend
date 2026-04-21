const API_BASE_URL = String(import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')
const OAUTH_INTENT_KEY = 'oauth_intent'

function redirectToOAuthProvider(provider: 'github' | 'google') {
  sessionStorage.setItem(OAUTH_INTENT_KEY, 'login')
  window.location.assign(`${API_BASE_URL}/api/auth/oauth/${provider}?intent=login`)
}

export default function OAuthButtons() {
  return (
    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
      <button
        type='button'
        onClick={() => redirectToOAuthProvider('github')}
        className='inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#24292f] px-4 font-medium text-white shadow-sm transition-colors hover:bg-[#1b1f23]'
      >
        Continuar con GitHub
      </button>
      <button
        type='button'
        onClick={() => redirectToOAuthProvider('google')}
        className='inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#dadce0] bg-[#ffffff] px-4 font-medium text-[#3c4043] shadow-sm transition-colors hover:bg-[#f8f9fa]'
      >
        Continuar con Google
      </button>
    </div>
  )
}