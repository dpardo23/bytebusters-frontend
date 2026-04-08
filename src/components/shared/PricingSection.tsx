import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Gratuito',
    price: '0',
    description: 'Perfecto para empezar',
    cta: 'Comenzar gratis',
    ctaPath: '/auth/register',
    popular: false,
    features: ['1 portafolio publico', 'Hasta 5 proyectos', 'Perfil basico', 'Analiticas basicas'],
  },
  {
    name: 'Pro',
    price: '9',
    description: 'Para profesionales serios',
    cta: 'Empezar prueba gratis',
    ctaPath: '/auth/register',
    popular: true,
    features: [
      'Todo del plan gratuito',
      'Proyectos ilimitados',
      'Integracion GitHub',
      'Integracion LinkedIn',
      'Sin marca de agua',
    ],
  },
  {
    name: 'Equipos',
    price: '29',
    description: 'Para empresas y reclutadores',
    cta: 'Contactar ventas',
    ctaPath: '/auth/register',
    popular: false,
    features: ['Todo del plan pro', 'Panel de reclutamiento', 'Busqueda avanzada', 'Guardar candidatos'],
  },
]

export default function PricingSection() {
  return (
    <section id='pricing' className='px-4 py-20'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-14 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-foreground md:text-4xl'>Planes para cada necesidad</h2>
          <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
            Comienza gratis y escala cuando lo necesites.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${
                plan.popular ? 'scale-[1.02] border-primary bg-primary/5 shadow-xl' : 'border-border bg-card'
              }`}
            >
              {plan.popular ? (
                <span className='absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground'>
                  Mas popular
                </span>
              ) : null}

              <h3 className='text-xl font-bold text-foreground'>{plan.name}</h3>
              <p className='mt-1 text-sm text-muted-foreground'>{plan.description}</p>
              <p className='mb-6 mt-5'>
                <span className='text-4xl font-bold text-foreground'>${plan.price}</span>
                <span className='text-muted-foreground'>/mes</span>
              </p>

              <ul className='mb-8 space-y-3'>
                {plan.features.map((feature) => (
                  <li key={feature} className='flex items-start gap-2 text-sm text-foreground'>
                    <Check className='mt-0.5 h-4 w-4 shrink-0 text-primary' />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.ctaPath}
                className={`inline-flex h-11 w-full items-center justify-center rounded-xl px-4 font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-border bg-background text-foreground hover:bg-accent'
                }`}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}