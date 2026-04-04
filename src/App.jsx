import { useState } from 'react'

const initialFormState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'professional',
}

function IconCode() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18l-6-6 6-6" />
      <path d="M15 6l6 6-6 6" />
    </svg>
  )
}

function IconEye({ hidden = false }) {
  return hidden ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58" />
      <path d="M9.88 5.08A10.94 10.94 0 0 1 12 4c5.5 0 9.5 8 9.5 8a20.6 20.6 0 0 1-4.03 4.8" />
      <path d="M6.1 6.1C3.5 8 2.5 12 2.5 12S6.5 20 12 20a10.86 10.86 0 0 0 3.9-.72" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7.5 10-7.5S22 12 22 12s-3.5 7.5-10 7.5S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3.25" />
    </svg>
  )
}

function IconSocial({ type }) {
  if (type === 'github') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.57v-2.02c-3.34.73-4.04-1.4-4.04-1.4-.54-1.37-1.32-1.73-1.32-1.73-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.24 1.83 1.24 1.06 1.82 2.78 1.3 3.46.99.11-.77.42-1.3.77-1.6-2.67-.31-5.47-1.34-5.47-5.97 0-1.32.47-2.4 1.24-3.25-.12-.31-.54-1.54.12-3.21 0 0 1.01-.32 3.3 1.24a11.4 11.4 0 0 1 6.01 0c2.29-1.56 3.3-1.24 3.3-1.24.66 1.67.24 2.9.12 3.21.77.85 1.24 1.93 1.24 3.25 0 4.64-2.8 5.66-5.48 5.96.43.38.81 1.13.81 2.28v3.38c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.66H9.35V9h3.42v1.56h.05c.48-.91 1.64-1.87 3.37-1.87 3.6 0 4.26 2.37 4.26 5.45v6.31ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

function App() {
  const [form, setForm] = useState(initialFormState)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (form.password !== form.confirmPassword) {
      setError('Las contrasenas no coinciden')
      return
    }

    if (form.password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres')
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 900))
    setIsLoading(false)

    setSuccess(`Cuenta creada para ${form.name || 'tu usuario'} como ${form.role === 'professional' ? 'Profesional' : 'Reclutador'}.`)
    setForm(initialFormState)
    setShowPassword(false)
  }

  return (
    <main className="register-shell">
      <div className="register-backdrop" aria-hidden="true">
        <span className="orb orb-one" />
        <span className="orb orb-two" />
        <span className="grid-noise" />
      </div>

      <section className="register-card" aria-label="Formulario de registro">
        <div className="brand-row">
          <a className="brand" href="/" aria-label="Ir al inicio">
            <span className="brand-mark"><IconCode /></span>
            <span>DevFolio</span>
          </a>
          <p className="eyebrow">Crea tu cuenta gratuita</p>
        </div>

        <div className="panel">
          <header className="panel-header">
            <p className="panel-kicker">Registro</p>
            <h1>Crear cuenta</h1>
            <p>Completa el formulario para empezar a construir tu portafolio.</p>
          </header>

          <form className="form" onSubmit={handleSubmit}>
            <fieldset className="fieldset">
              <legend>Tipo de cuenta</legend>
              <div className="role-grid">
                <label className={`role-card ${form.role === 'professional' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="professional"
                    checked={form.role === 'professional'}
                    onChange={updateField('role')}
                  />
                  <span className="role-icon" aria-hidden="true">⌘</span>
                  <strong>Profesional</strong>
                  <span>Crear portafolio</span>
                </label>

                <label className={`role-card ${form.role === 'recruiter' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={form.role === 'recruiter'}
                    onChange={updateField('role')}
                  />
                  <span className="role-icon" aria-hidden="true">◎</span>
                  <strong>Reclutador</strong>
                  <span>Buscar talento</span>
                </label>
              </div>
            </fieldset>

            <label className="field">
              <span>Nombre completo</span>
              <input
                type="text"
                placeholder="Tu nombre"
                value={form.name}
                onChange={updateField('name')}
                required
              />
            </label>

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={updateField('email')}
                required
              />
            </label>

            <label className="field">
              <span>Contrasena</span>
              <div className="password-row">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimo 6 caracteres"
                  value={form.password}
                  onChange={updateField('password')}
                  required
                />
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                >
                  <IconEye hidden={showPassword} />
                </button>
              </div>
            </label>

            <label className="field">
              <span>Confirmar contrasena</span>
              <input
                type="password"
                placeholder="Repite la contrasena"
                value={form.confirmPassword}
                onChange={updateField('confirmPassword')}
                required
              />
            </label>

            {error ? <p className="message error">{error}</p> : null}
            {success ? <p className="message success">{success}</p> : null}

            <button className="primary-button" type="submit" disabled={isLoading}>
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="divider">
            <span>O registrate con</span>
          </div>

          <div className="social-grid">
            <button type="button" className="secondary-button">
              <span className="social-icon"><IconSocial type="github" /></span>
              GitHub
            </button>
            <button type="button" className="secondary-button">
              <span className="social-icon"><IconSocial type="linkedin" /></span>
              LinkedIn
            </button>
          </div>

          <footer className="panel-footer">
            <p>
              Ya tienes cuenta? <a href="/">Iniciar sesion</a>
            </p>
            <p className="legal">
              Al crear una cuenta, aceptas nuestros <a href="/">Terminos de Servicio</a> y <a href="/">Politica de Privacidad</a>.
            </p>
          </footer>
        </div>
      </section>
    </main>
  )
}

export default App
