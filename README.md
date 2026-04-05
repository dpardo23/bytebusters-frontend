# bytebusters-frontend

Frontend de ByteBusters construido con React, Vite y Tailwind CSS.

## Estructura del proyecto

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
				LoginForm.tsx
				ProfessionalRegisterForm.tsx
				RecruiterRegisterForm.tsx
				OAuthButtons.tsx
			profile/
				ProfileHeader.tsx
				StatusBadge.tsx
				CareerTimeline.tsx
				GuestProfileView.tsx
			ui/
				Button.tsx
				Input.tsx
				Modal.tsx
				Avatar.tsx
				Skeleton.tsx
			shared/
				Navbar.tsx
				Footer.tsx

		layouts/
				AuthGuard.tsx
				RoleGuard.tsx

		pages/
				LandingPage.tsx
			auth/
					LoginPage.tsx
					ProfessionalRegisterPage.tsx
					RecruiterRegisterPage.tsx
			dashboard/
					DashboardPage.tsx
			profile/
					ProfilePage.tsx
					PublicProfilePage.tsx

		store/
			auth/
					authStore.ts
			profile/
					profileStore.ts

		hooks/
			auth/
					useAuth.ts
			profile/
					useProfile.ts
				useRoleAccess.ts

		services/
			auth/
					authService.ts
			profile/
					profileService.ts

		lib/
			api/
					httpClient.ts
			constants/
					roles.ts
			validations/
					authValidations.ts

		utils/
				index.ts

		styles/
			themes/
					light.ts
					dark.ts
			index.css
			tsconfig.json
			vite.config.ts

		types/
				auth.types.ts
				profile.types.ts

			App.tsx
			main.tsx
			router.tsx
```

## Como leer la estructura

- assets: recursos estaticos (imagenes e iconos).
- components: piezas reutilizables de UI y componentes por dominio.
- layouts: estructuras de alto nivel de pagina (guards, wrappers y composicion de vistas).
- pages: pantallas principales de la aplicacion.
- store: estado global o compartido por dominio.
- hooks: logica reutilizable en forma de hooks.
- services: acceso a APIs y logica de datos externa.
- lib: infraestructura compartida (cliente HTTP, constantes y validaciones).
- utils: helpers puros y funciones utilitarias transversales.
- styles: estilos globales y temas visuales.
- types: contratos y tipos compartidos del proyecto.

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm preview`
