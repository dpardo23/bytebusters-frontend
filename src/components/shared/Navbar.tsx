import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, Code2, Menu, Moon, X } from 'lucide-react'
import useAuth from '../../hooks/auth/useAuth'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    photoBase64: ''
  })

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/profile/hero-section/${user.id}`)
        .then(res => {
          if (!res.ok) throw new Error("Perfil no encontrado");
          return res.json();
        })
        .then(data => {
          setProfileData({
            name: data.name || user.name, 
            photoBase64: data.photoBase64 || ''
          });
        })
        .catch(err => console.error("Error cargando avatar del navbar:", err));
    }
  }, [user?.id, user?.name]);

  async function handleLogout(): Promise<void> {
    await logout()
    setIsProfileMenuOpen(false)
    navigate('/')
  }

  const displayName = profileData.name || 'Usuario';
  
  const displayFirstName = displayName.split(' ')[0];

  const displayAvatar = profileData.photoBase64 
    ? profileData.photoBase64 
    : user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;

  return (
    <header className='fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur'>
      <nav className='mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4'>
        <Link to='/' className='flex items-center gap-2 text-2xl font-bold text-foreground'>
          <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
            <Code2 className='h-5 w-5' />
          </span>
          EthosHub
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
          {!user ? (
            <Link
              to='/auth/login'
              className='rounded-md px-4 py-2 font-medium text-foreground transition-colors hover:bg-accent'
            >
              Iniciar Sesion
            </Link>
          ) : null}
          {user ? (
            <div className='relative'>
              <button
                type='button'
                className='inline-flex min-w-52 items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 py-2 text-foreground hover:bg-accent'
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              >
                <span className='inline-flex items-center gap-2'>
                  <img src={displayAvatar} alt={displayFirstName} className='h-7 w-7 rounded-full bg-muted object-cover' />
                  <span className='max-w-32 truncate font-medium'>{displayFirstName}</span>
                </span>
                <ChevronDown className='h-4 w-4 text-muted-foreground' />
              </button>

              {isProfileMenuOpen ? (
                <div className='absolute right-0 top-[calc(100%+8px)] z-50 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-lg'>
                  <div className='border-b border-border px-4 py-3 font-semibold text-foreground'>Mi cuenta</div>
                  <div className='p-2'>
                    
                    <Link
                       to={`/profile/${user.id}`} 
                       onClick={() => setIsProfileMenuOpen(false)}
                      className='block w-full rounded-lg px-3 py-2 text-left text-foreground hover:bg-accent'
                    >
                      Mi perfil
                    </Link>

                    <Link
                      to={`/user/${user.id}`}
                      onClick={() => setIsProfileMenuOpen(false)}
                      className='block w-full rounded-lg px-3 py-2 text-left text-foreground hover:bg-accent'
                    >
                      Configuracion
                    </Link>
                    <button
                      type='button'
                      onClick={handleLogout}
                      className='w-full rounded-lg px-3 py-2 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
                    >
                      Cerrar sesion
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              to='/auth/register'
              className='rounded-xl bg-primary px-5 py-2 font-semibold text-primary-foreground transition-opacity hover:opacity-90'
            >
              Crear Cuenta
            </Link>
          )}
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
            {!user ? (
              <Link
                to='/auth/login'
                className='rounded-md px-2 py-2 text-foreground transition-colors hover:bg-accent'
                onClick={() => setIsOpen(false)}
              >
                Iniciar Sesion
              </Link>
            ) : null}
            {user ? (
              <div className='inline-flex min-w-52 items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-foreground'>
                <img src={displayAvatar} alt={displayFirstName} className='h-7 w-7 rounded-full bg-muted object-cover' />
                <span className='max-w-36 truncate font-medium'>{displayFirstName}</span>
              </div>
            ) : (
              <Link
                to='/auth/register'
                className='rounded-xl bg-primary px-4 py-2 text-center font-semibold text-primary-foreground'
                onClick={() => setIsOpen(false)}
              >
                Crear Cuenta
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
