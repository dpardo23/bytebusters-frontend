import type { Metadata } from 'next'
import { JetBrains_Mono, DM_Sans, Sora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/contexts/theme-context'
import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'DevFolio - Tu portafolio digital profesional',
  description:
    'Plataforma SaaS para crear portafolios digitales profesionales. Muestra tu talento, conecta con reclutadores y destaca en el mercado tech.',
  keywords: ['portafolio', 'desarrollador', 'profesional', 'tech', 'empleo', 'talento'],
  authors: [{ name: 'DevFolio' }],
  openGraph: {
    title: 'DevFolio - Tu portafolio digital profesional',
    description: 'Plataforma SaaS para crear portafolios digitales profesionales',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${jetbrainsMono.variable} ${sora.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}