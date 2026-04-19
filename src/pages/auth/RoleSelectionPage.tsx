import { ChevronLeft, Briefcase, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import { getAuthState, updateAuthenticatedUser } from '../../store/auth/authStore'
import { updateMockAccountRole } from '../../lib/mockAuthStorage'

export default function RoleSelectionPage() {
  const navigate = useNavigate()

  const handleRoleSelect = (role: 'professional' | 'recruiter') => {
    const currentUser = getAuthState().user

    if (currentUser?.email) {
      updateMockAccountRole(currentUser.email, role)
      updateAuthenticatedUser({ role })
    }

    navigate('/profile')
  }

  return (
    <section className='flex min-h-screen flex-col items-center justify-center bg-muted/30 py-10'>
      <Link
        to='/'
        className='fixed left-4 top-4 inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent'
      >
        <ChevronLeft className='h-4 w-4' />
        Volver al Inicio
      </Link>

      <div className='w-full max-w-2xl px-4'>
        <div className='mx-auto mb-8 max-w-xl text-center'>
          <h1 className='text-3xl font-bold text-foreground'>¿Cuál es tu rol?</h1>
          <p className='mt-2 text-muted-foreground'>
            Elige si eres un profesional buscando oportunidades o un reclutador buscando talento.
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          {/* Professional Option */}
          <button
            onClick={() => handleRoleSelect('professional')}
            className='group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:border-primary'
          >
            <div className='relative z-10'>
              <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <Users className='h-6 w-6' />
              </div>
              <h2 className='text-xl font-bold text-foreground'>Profesional</h2>
              <p className='mt-2 text-sm text-muted-foreground'>
                Muestra tu portafolio, habilidades y experiencia. Conecta con oportunidades laborales.
              </p>
              <div className='mt-6'>
                <Button variant='default' className='w-full'>
                  Continuar como Profesional
                </Button>
              </div>
            </div>
          </button>

          {/* Recruiter Option */}
          <button
            onClick={() => handleRoleSelect('recruiter')}
            className='group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:border-primary'
          >
            <div className='relative z-10'>
              <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <Briefcase className='h-6 w-6' />
              </div>
              <h2 className='text-xl font-bold text-foreground'>Reclutador</h2>
              <p className='mt-2 text-sm text-muted-foreground'>
                Busca talento, publica ofertas de trabajo y gestiona tu equipo de contratación.
              </p>
              <div className='mt-6'>
                <Button variant='default' className='w-full'>
                  Continuar como Reclutador
                </Button>
              </div>
            </div>
          </button>
        </div>
      </div>

      <p className='mt-12 px-4 text-center text-sm text-muted-foreground'>
        Al crear una cuenta, aceptas nuestros Términos de Servicio y Política de Privacidad.
      </p>
    </section>
  )
}
