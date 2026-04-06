import type { ButtonHTMLAttributes, ReactNode } from 'react'

const variantClasses = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  ghost: 'text-foreground hover:bg-accent',
  outline: 'border border-border bg-background text-foreground hover:bg-accent',
}

const sizeClasses = {
  default: 'h-10 px-4 text-sm',
  lg: 'h-12 px-8 text-base',
  icon: 'h-10 w-10 px-0',
}

type ButtonVariant = keyof typeof variantClasses
type ButtonSize = keyof typeof sizeClasses

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
  variant?: ButtonVariant
  size?: ButtonSize
}

export default function Button({
  children,
  type = 'button',
  className = '',
  variant = 'default',
  size = 'default',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}