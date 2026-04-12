import { Link } from 'react-router-dom'
import { Code2 } from 'lucide-react'

const footerLinks = {
  product: [
    { label: 'Caracteristicas' },
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
    <footer className='border-t border-border bg-[rgba(83,78,220,0.10)] dark:bg-[rgba(120,110,255,0.20)]'>
      <div className='mx-auto w-full max-w-6xl px-4 py-12'>
        <div className='mb-10 grid grid-cols-2 gap-8 md:grid-cols-5'>
          <div className='col-span-2 md:col-span-2'>
            <Link to='/' className='mb-4 inline-flex items-center gap-2 text-2xl font-bold text-foreground'>
              <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
                <Code2 className='h-5 w-5' />
              </span>
              EthosHub
            </Link>
            <p className='max-w-xs text-sm text-muted-foreground'>
              La plataforma para profesionales tech que quieren destacar.
            </p>
            <div className='mt-4 flex items-center gap-2 text-muted-foreground'>
              <a
                href='https://www.facebook.com'
                target='_blank'
                rel='noreferrer'
                aria-label='Facebook'
                className='inline-flex items-center gap-2 rounded-md border border-border bg-background/60 px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-background/90'
              >
                <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary'>
                  <svg viewBox='0 0 24 24' aria-hidden='true' className='h-3.5 w-3.5 fill-current'>
                    <path d='M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9V12.06h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.77l-.44 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94z' />
                  </svg>
                </span>
                Bytebusters
              </a>
              <a
                href='https://www.tiktok.com'
                target='_blank'
                rel='noreferrer'
                aria-label='TikTok'
                className='inline-flex items-center gap-2 rounded-md border border-border bg-background/60 px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-background/90'
              >
                <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary'>
                  <svg viewBox='0 0 24 24' aria-hidden='true' className='h-3.5 w-3.5 fill-current'>
                    <path d='M16.6 5.82c1.12.8 2.5 1.27 3.98 1.27v3.09a7.06 7.06 0 0 1-3.98-1.22v5.84c0 3.42-2.79 6.2-6.23 6.2s-6.23-2.78-6.23-6.2 2.79-6.2 6.23-6.2c.33 0 .66.03.98.08v3.2a3.05 3.05 0 0 0-.98-.16c-1.66 0-3 1.33-3 2.98s1.34 2.98 3 2.98 3-1.33 3-2.98V3h3.23c.04.98.43 1.95 1 2.82z' />
                  </svg>
                </span>
                @bytebusters
              </a>
              <a
                href='https://www.instagram.com'
                target='_blank'
                rel='noreferrer'
                aria-label='Instagram'
                className='inline-flex items-center gap-2 rounded-md border border-border bg-background/60 px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-background/90'
              >
                <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary'>
                  <svg viewBox='0 0 24 24' aria-hidden='true' className='h-3.5 w-3.5 fill-current'>
                    <path d='M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.9A3.85 3.85 0 0 0 3.9 7.75v8.5a3.85 3.85 0 0 0 3.85 3.85h8.5a3.85 3.85 0 0 0 3.85-3.85v-8.5a3.85 3.85 0 0 0-3.85-3.85h-8.5zM12 7.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 1.9A2.6 2.6 0 1 0 14.6 12 2.6 2.6 0 0 0 12 9.4zm4.8-2.35a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1z' />
                  </svg>
                </span>
                @bytebusters
              </a>
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
          <p>2026 EthosHub. Todos los derechos reservados.</p>
          <p>Hecho para la comunidad tech.</p>
        </div>
      </div>
    </footer>
  )
}