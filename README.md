# bytebusters-frontend

Frontend en React + Vite + TypeScript + Tailwind.

## Estructura

```text
bytebusters-frontend/
  public/
    favicon.ico

  src/
    assets/
      images/
      icons/

    components/
      auth/
      profile/
      ui/
      shared/
      layout/

    pages/
      auth/
      dashboard/
      profile/

    store/
      auth/
      profile/

    hooks/
      auth/
      profile/

    services/
      auth/
      profile/

    lib/
      api/
      constants/
      validations/

    styles/
      themes/
      index.css

    types/
      auth.types.ts
      profile.types.ts

    App.tsx
    main.tsx
    router.tsx

  .env
  .env.example
  .gitignore
  vite.config.ts
  tailwind.config.ts
  package.json
  README.md
```

## Como leer la estructura

- components: piezas reutilizables de UI y componentes por dominio.
- layouts: estructuras de alto nivel de pagina, como guards y wrappers.
- pages: pantallas principales de la aplicacion.
- store: estado global o compartido por dominio.
- hooks: logica reutilizable en forma de hooks.
- services: acceso a APIs y logica de datos externa.
- lib: infraestructura compartida, como el cliente HTTP, constantes y validaciones.
- utils: helpers puros y funciones utilitarias transversales.
- styles: estilos globales y temas visuales.
- types: contratos y tipos compartidos del proyecto.

## Scripts

- pnpm dev
- pnpm build
- pnpm preview
- pnpm typecheck
