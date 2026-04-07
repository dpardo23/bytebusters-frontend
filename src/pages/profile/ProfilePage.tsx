import { BriefcaseBusiness, Building2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import useAuth from '../../hooks/auth/useAuth'
import { ProfileHeader } from '../../components/profile/ProfileHeader'
import { ProfileEditForm } from '../../components/profile/ProfileEditForm'
import RecruiterProfileSetupForm from '../../components/profile/RecruiterProfileSetupForm'

function RoleCard({
  title,
  description,
  buttonLabel,
  onSelect,
  icon,
}: {
  title: string
  description: string
  buttonLabel: string
  onSelect: () => void
  icon: ReactNode
}) {
  return (
    <article className='rounded-2xl border border-border bg-card p-6 shadow-sm'>
      <span className='mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary'>
        {icon}
      </span>
      <h3 className='text-xl font-semibold text-foreground'>{title}</h3>
      <p className='mt-2 text-sm text-muted-foreground'>{description}</p>
      <button
        type='button'
        onClick={onSelect}
        className='mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 font-medium text-primary-foreground transition-opacity hover:opacity-90'
      >
        {buttonLabel}
      </button>
    </article>
  )
}

export default function ProfilePage() {
  const { user, updateRole, selectAccountRole } = useAuth()
  const [isSelectingRecruiter, setIsSelectingRecruiter] = useState(false)
  const [roleSelectionError, setRoleSelectionError] = useState('')

  const handleSelectRecruiter = async () => {
    if (isSelectingRecruiter) {
      return
    }

    setRoleSelectionError('')
    setIsSelectingRecruiter(true)

    const result = await selectAccountRole('recruiter')
    if (!result.success) {
      setRoleSelectionError(result.error)
      setIsSelectingRecruiter(false)
      return
    }

    setIsSelectingRecruiter(false)
  }

  if (!user) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='animate-pulse text-gray-500'>Cargando perfil...</p>
      </div>
    )
  }

  const isBasicRole = user.role === 'basic'
  const isProfessional = user.role === 'professional'
  const isRecruiter = user.role === 'recruiter'

  return (
    <div className='min-h-screen bg-gray-50 pb-20 pt-20'>
      <ProfileHeader user={user} />

      <div className='mx-auto mt-8 max-w-4xl space-y-6 px-4'>
        {isBasicRole ? (
          <section className='rounded-2xl border border-border bg-card p-6 shadow-sm'>
            <h2 className='text-2xl font-semibold text-foreground'>Elige el tipo de cuenta</h2>
            <p className='mt-2 text-sm text-muted-foreground'>
              Tu cuenta ya fue creada. Ahora selecciona si usaras EthosHub como profesional o reclutador.
            </p>

            <div className='mt-6 grid gap-4 md:grid-cols-2'>
              <RoleCard
                title='Cuenta profesional'
                description='Ideal para mostrar experiencia, educacion, proyectos y disponibilidad laboral.'
                buttonLabel='Quiero ser profesional'
                onSelect={() => {
                  setRoleSelectionError('')
                  updateRole('professional')
                }}
                icon={<BriefcaseBusiness className='h-5 w-5' />}
              />
              <RoleCard
                title='Cuenta reclutador'
                description='Pensada para empresas que desean gestionar vacantes y encontrar talento.'
                buttonLabel={isSelectingRecruiter ? 'Actualizando...' : 'Quiero ser reclutador'}
                onSelect={handleSelectRecruiter}
                icon={<Building2 className='h-5 w-5' />}
              />
            </div>

            {roleSelectionError ? <p className='mt-4 text-sm text-destructive'>{roleSelectionError}</p> : null}
          </section>
        ) : null}

        {!isBasicRole ? (
          <div className='flex justify-end'>
            <button
              type='button'
              onClick={() => updateRole('basic')}
              className='inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent'
            >
              Cambiar tipo de cuenta
            </button>
          </div>
        ) : null}

        {isProfessional ? <ProfileEditForm initialUser={user} /> : null}
        {isRecruiter ? <RecruiterProfileSetupForm /> : null}
      </div>
    </div>
  )
}