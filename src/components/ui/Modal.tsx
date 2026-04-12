import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title?: string
  onClose: () => void
  children: ReactNode
}

export default function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm'>
      <div
        className='absolute inset-0 cursor-pointer'
        onClick={onClose}
        aria-hidden='true'
      />

      <div className='relative z-10 w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            {title ? <h2 className='text-xl font-semibold text-foreground'>{title}</h2> : null}
          </div>

          <button
            type='button'
            onClick={onClose}
            className='inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
            aria-label='Cerrar modal'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='mt-4'>{children}</div>
      </div>
    </div>
  )
}
