import { ArrowRight, BriefcaseBusiness, Sparkles, UserRoundSearch } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HeroSection() {
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
              to='/auth/register'
              className='inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90'
            >
              Crear mi portafolio
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

        <div className='relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl'>
          <div className='flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-3'>
            <span className='h-3 w-3 rounded-full bg-red-500' />
            <span className='h-3 w-3 rounded-full bg-yellow-500' />
            <span className='h-3 w-3 rounded-full bg-green-500' />
            <span className='ml-3 text-sm text-muted-foreground'>devfolio.com/ana-garcia</span>
          </div>
          <div className='grid gap-6 p-6 md:grid-cols-[220px,1fr] md:p-8'>
            <div className='flex flex-col items-center gap-4 md:items-start'>
              <img
                src='https://api.dicebear.com/7.x/avataaars/svg?seed=Ana'
                alt='Ana Garcia'
                className='h-24 w-24 rounded-full bg-primary/20'
              />
              <div className='text-center md:text-left'>
                <h3 className='text-xl font-bold text-foreground'>Ana Garcia</h3>
                <p className='text-sm text-muted-foreground'>Full Stack Developer</p>
              </div>
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              {[{ title: 'E-Commerce Platform', tech: 'Next.js, Stripe' }, { title: 'Task Manager', tech: 'React, Socket.io' }].map(
                (project) => (
                  <article key={project.title} className='rounded-xl border border-border bg-background p-4'>
                    <div className='mb-3 h-24 rounded-md bg-muted' />
                    <h4 className='text-sm font-semibold text-foreground'>{project.title}</h4>
                    <p className='text-xs text-muted-foreground'>{project.tech}</p>
                  </article>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}