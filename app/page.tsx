import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl text-center space-y-6">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">DevFolio</p>
        <h1 className="text-4xl font-semibold tracking-tight">Base Next.js lista para tus componentes</h1>
        <p className="text-muted-foreground">
          La migración ya incluye layout, providers, UI primitives y datos simulados.
        </p>
        <Link className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-primary-foreground" href="/register">
          Ir al registro
        </Link>
      </div>
    </main>
  )
}