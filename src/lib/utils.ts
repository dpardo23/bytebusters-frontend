import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function formatDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date)
}

export function getYoutubeEmbedUrl(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) {
      return `https://www.youtube.com/embed/${match[1]}`
    }
  }

  return null
}

export function getVimeoEmbedUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/)
  if (!match?.[1]) {
    return null
  }

  return `https://player.vimeo.com/video/${match[1]}`
}

export function isValidMediaUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    const allowedHosts = ['youtube.com', 'www.youtube.com', 'youtu.be', 'vimeo.com', 'www.vimeo.com']
    return allowedHosts.includes(parsed.hostname)
  } catch {
    return false
  }
}

export function getMediaType(url: string): 'youtube' | 'vimeo' | 'figma' | 'slides' {
  const value = url.toLowerCase()
  if (value.includes('youtube.com') || value.includes('youtu.be')) return 'youtube'
  if (value.includes('vimeo.com')) return 'vimeo'
  if (value.includes('figma.com')) return 'figma'
  return 'slides'
}
