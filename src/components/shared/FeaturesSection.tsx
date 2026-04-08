import { BarChart3, BriefcaseBusiness, Palette, Search, Shield, UserRoundSearch, Users, Zap } from 'lucide-react'

const features = [
  {
    icon: Palette,
    title: 'Diseno personalizable',
    description: 'Personaliza colores, tipografias y estilo para reflejar tu marca profesional.',
  },
  {
    icon: BarChart3,
    title: 'Analiticas detalladas',
    description: 'Mide visitas, clics e interes de reclutadores con metricas claras.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Integracion GitHub',
    description: 'Importa tus repositorios y lenguajes para mostrar evidencia real.',
  },
  {
    icon: UserRoundSearch,
    title: 'Integracion LinkedIn',
    description: 'Sincroniza experiencia y educacion para ahorrar tiempo.',
  },
  {
    icon: Shield,
    title: 'Control de privacidad',
    description: 'Configura que partes del perfil son publicas o privadas.',
  },
  {
    icon: Search,
    title: 'SEO optimizado',
    description: 'Aumenta visibilidad de tu perfil en buscadores.',
  },
  {
    icon: Zap,
    title: 'Rendimiento premium',
    description: 'Carga veloz y experiencia fluida en desktop y mobile.',
  },
  {
    icon: Users,
    title: 'Red de talento',
    description: 'Conecta con profesionales y reclutadores en una sola plataforma.',
  },
]

export default function FeaturesSection() {
  return (
    <section id='features' className='bg-muted/40 px-4 py-20'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-14 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-foreground md:text-4xl'>
            Todo lo que necesitas para destacar
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
            Herramientas potentes para crear un portafolio profesional y mostrar tu potencial.
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {features.map((feature) => (
            <article
              key={feature.title}
              className='rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg'
            >
              <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                <feature.icon className='h-6 w-6 text-primary' />
              </div>
              <h3 className='mb-2 text-lg font-semibold text-foreground'>{feature.title}</h3>
              <p className='text-sm text-muted-foreground'>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}