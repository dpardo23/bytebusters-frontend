import type { ImgHTMLAttributes } from 'react'

type AvatarProps = ImgHTMLAttributes<HTMLImageElement>

export default function Avatar({ src, alt = 'avatar' }: AvatarProps) {
  return <img src={src} alt={alt} />
}