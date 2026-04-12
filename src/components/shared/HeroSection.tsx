import { ArrowRight, BriefcaseBusiness, Sparkles, UserRoundSearch } from 'lucide-react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/auth/useAuth'

export default function HeroSection() {
  const { user } = useAuth()
  const primaryCtaHref = user?.id ? `/profile/${user.id}` : '/auth/register'
  const primaryCtaLabel = user ? 'Ir a mi perfil' : 'Crear mi portafolio'

  return (
    <section className='relative overflow-hidden px-4 pb-20 pt-28'>
      <div className='absolute inset-0 -z-10'>
        <div className='absolute left-8 top-20 h-72 w-72 rounded-full bg-primary/12 blur-3xl' />
        <div className='absolute bottom-20 right-10 h-96 w-96 rounded-full bg-secondary/15 blur-3xl' />
      </div>

      <div className='mx-auto max-w-6xl'>
        <div className='text-center'>
          <div className='mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary'>
            <Sparkles className='h-4 w-4' />
            <span>La plataforma para desarrolladores</span>
          </div>

          <h1 className='mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl'>
            Tu portafolio digital
            <span className='block text-primary'>profesional</span>
          </h1>

          <p className='mx-auto mb-10 max-w-3xl text-pretty text-lg text-muted-foreground md:text-2xl'>
            Crea un portafolio impresionante, muestra tus proyectos y conecta con reclutadores
            de las mejores empresas tech. Todo en un solo lugar.
          </p>

          <div className='mb-14 flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Link
              to={primaryCtaHref}
              className='inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90'
            >
              {primaryCtaLabel}
              <ArrowRight className='h-5 w-5' />
            </Link>
            <button
              type='button'
              disabled
              className='inline-flex h-12 cursor-not-allowed items-center rounded-xl border border-border bg-background px-8 text-lg font-semibold text-foreground/60'
            >
              Explorar talento
            </button>
          </div>

          <div className='mb-12 flex flex-col items-center justify-center gap-6 text-sm text-muted-foreground sm:flex-row'>
            <div className='flex items-center gap-3'>
              <div className='flex -space-x-2'>
                {['Ana', 'Luis', 'Val', 'Nina', 'Pablo'].map((seed) => (
                  <img
                    key={seed}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                    alt='Avatar'
                    className='h-8 w-8 rounded-full border-2 border-background bg-muted'
                  />
                ))}
              </div>
              <span>+1,200 profesionales</span>
            </div>
            <div className='flex items-center gap-5'>
              <span className='inline-flex items-center gap-1'>
                <BriefcaseBusiness className='h-4 w-4' /> Integracion GitHub
              </span>
              <span className='inline-flex items-center gap-1'>
                <UserRoundSearch className='h-4 w-4' /> Integracion LinkedIn
              </span>
            </div>
          </div>
        </div>

        <div className='relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl'>
          <div className='flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3'>
            <span className='text-sm text-muted-foreground'>ethoshub.com/u/ana-garcia</span>
            <span className='rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary'>
              Perfil verificado
            </span>
          </div>

          <div className='grid gap-5 p-6 text-left md:grid-cols-[220px,1fr] md:p-8'>
            <aside className='rounded-xl border border-border bg-background/60 p-5'>
              <div className='mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-xl font-bold text-primary'>
                AG
              </div>
              <h3 className='text-lg font-bold text-foreground'>Ana Garcia</h3>
              <p className='mt-1 text-sm text-muted-foreground'>Senior Full Stack Engineer</p>
              <p className='mt-3 text-sm text-muted-foreground'>Cochabamba, Bolivia • +8 años</p>
            </aside>

            <div className='space-y-4'>
              <section className='rounded-xl border border-border bg-background/70 p-4'>
                <p className='text-sm text-foreground'>
                  Construye productos SaaS escalables con foco en experiencia de usuario,
                  arquitectura frontend y calidad tecnica.
                </p>
                <div className='mt-3 flex flex-wrap gap-2'>
                  {['React', 'TypeScript', 'Node.js', 'PostgreSQL'].map((skill) => (
                    <span key={skill} className='rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground'>
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              <section className='grid gap-3 sm:grid-cols-3'>
                {[
                  { label: 'Proyectos', value: '34' },
                  { label: 'Recomendaciones', value: '18' },
                  { label: 'Respuesta', value: '97%' },
                ].map((item) => (
                  <article key={item.label} className='rounded-xl border border-border bg-background/70 p-4'>
                    <p className='text-2xl font-bold text-foreground'>{item.value}</p>
                    <p className='mt-1 text-xs text-muted-foreground'>{item.label}</p>
                  </article>
                ))}
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}