import { Link } from 'react-router-dom'
import { Code2, Globe, Network } from 'lucide-react'

const footerLinks = {
  product: [
    { label: 'Caracteristicas' },
    { label: 'Precios' },
    { label: 'Explorar Talento' },
  ],
  company: [
    { label: 'Sobre Nosotros' },
    { label: 'Blog' },
    { label: 'Contacto' },
  ],
  legal: [
    { label: 'Privacidad' },
    { label: 'Terminos' },
  ],
}

export default function Footer() {
  return (
    <footer className='border-t border-border bg-muted/40'>
      <div className='mx-auto w-full max-w-6xl px-4 py-12'>
        <div className='mb-10 grid grid-cols-2 gap-8 md:grid-cols-5'>
          <div className='col-span-2 md:col-span-2'>
            <Link to='/' className='mb-4 inline-flex items-center gap-2 text-2xl font-bold text-foreground'>
              <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
                <Code2 className='h-5 w-5' />
              </span>
              DevFolio
            </Link>
            <p className='max-w-xs text-sm text-muted-foreground'>
              La plataforma para profesionales tech que quieren destacar.
            </p>
            <div className='mt-4 flex items-center gap-3 text-muted-foreground'>
              <button
                type='button'
                disabled
                aria-label='Website'
                className='cursor-not-allowed rounded-md p-2 text-muted-foreground/60'
              >
                <Globe className='h-5 w-5' />
              </button>
              <button
                type='button'
                disabled
                aria-label='LinkedIn'
                className='cursor-not-allowed rounded-md p-2 text-muted-foreground/60'
              >
                <Network className='h-5 w-5' />
              </button>
            </div>
          </div>

          <div>
            <h4 className='mb-3 font-semibold text-foreground'>Producto</h4>
            <ul className='space-y-2 text-sm'>
              {footerLinks.product.map((item) => (
                <li key={item.label} className='cursor-not-allowed text-muted-foreground/60'>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='mb-3 font-semibold text-foreground'>Empresa</h4>
            <ul className='space-y-2 text-sm'>
              {footerLinks.company.map((item) => (
                <li key={item.label} className='cursor-not-allowed text-muted-foreground/60'>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='mb-3 font-semibold text-foreground'>Legal</h4>
            <ul className='space-y-2 text-sm'>
              {footerLinks.legal.map((item) => (
                <li key={item.label} className='cursor-not-allowed text-muted-foreground/60'>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between'>
          <p>2026 DevFolio. Todos los derechos reservados.</p>
          <p>Hecho para la comunidad tech.</p>
        </div>
      </div>
    </footer>
  )
}