import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Code2, Menu, Moon, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className='fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur'>
      <nav className='mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4'>
        <Link to='/' className='flex items-center gap-2 text-2xl font-bold text-foreground'>
          <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
            <Code2 className='h-5 w-5' />
          </span>
          DevFolio
        </Link>

        <div className='hidden items-center gap-8 md:flex'>
          <span className='cursor-not-allowed text-muted-foreground/60'>
            Caracteristicas
          </span>
          <span className='cursor-not-allowed text-muted-foreground/60'>
            Precios
          </span>
          <span className='cursor-not-allowed text-muted-foreground/60'>
            Explorar Talento
          </span>
        </div>

        <div className='hidden items-center gap-3 md:flex'>
          <button
            type='button'
            disabled
            className='inline-flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-md text-foreground/50'
            aria-label='Cambiar tema'
          >
            <Moon className='h-5 w-5' />
          </button>
          <span className='cursor-not-allowed rounded-md px-4 py-2 font-medium text-foreground/60'>
            Iniciar Sesion
          </span>
          <Link
            to='/auth/register/professional'
            className='rounded-xl bg-primary px-5 py-2 font-semibold text-primary-foreground transition-opacity hover:opacity-90'
          >
            Crear Cuenta
          </Link>
        </div>

        <div className='flex items-center gap-2 md:hidden'>
          <button
            type='button'
            disabled
            className='inline-flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-md text-foreground/50'
            aria-label='Cambiar tema'
          >
            <Moon className='h-5 w-5' />
          </button>
          <button
            type='button'
            onClick={() => setIsOpen((prev) => !prev)}
            className='inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent'
            aria-label='Abrir menu'
          >
            {isOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className='border-t border-border bg-background px-4 py-4 md:hidden'>
          <div className='mx-auto flex max-w-6xl flex-col gap-3'>
            <span className='cursor-not-allowed rounded-md px-2 py-2 text-muted-foreground/60'>
              Caracteristicas
            </span>
            <span className='cursor-not-allowed rounded-md px-2 py-2 text-muted-foreground/60'>
              Precios
            </span>
            <span className='cursor-not-allowed rounded-md px-2 py-2 text-muted-foreground/60'>
              Explorar Talento
            </span>
            <span className='cursor-not-allowed rounded-md px-2 py-2 text-muted-foreground/60'>
              Iniciar Sesion
            </span>
            <Link
              to='/auth/register/professional'
              className='rounded-xl bg-primary px-4 py-2 text-center font-semibold text-primary-foreground'
              onClick={() => setIsOpen(false)}
            >
              Crear Cuenta
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}