import { Network, Webhook } from 'lucide-react'
import Button from '../ui/Button'

export default function OAuthButtons() {
  return (
    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
      <Button type='button' variant='outline' className='h-11 w-full justify-center font-medium'>
        <Webhook className='h-4 w-4' />
        GitHub
      </Button>
      <Button type='button' variant='outline' className='h-11 w-full justify-center font-medium'>
        <Network className='h-4 w-4' />
        LinkedIn
      </Button>
    </div>
  )
}
