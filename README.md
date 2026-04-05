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
				LoginForm.jsx
				ProfessionalRegisterForm.jsx
				RecruiterRegisterForm.jsx
				OAuthButtons.jsx
			profile/
				ProfileHeader.jsx
				StatusBadge.jsx
				CareerTimeline.jsx
				GuestProfileView.jsx
			ui/
				Button.jsx
				Input.jsx
				Modal.jsx
				Avatar.jsx
				Skeleton.jsx
			shared/
				Navbar.jsx
				Footer.jsx

		layouts/
			AuthGuard.jsx
			RoleGuard.jsx

		pages/
			LandingPage.jsx
			auth/
				LoginPage.jsx
				ProfessionalRegisterPage.jsx
				RecruiterRegisterPage.jsx
			dashboard/
				DashboardPage.jsx
			profile/
				ProfilePage.jsx
				PublicProfilePage.jsx

		store/
			auth/
				authStore.js
			profile/
				profileStore.js

		hooks/
			auth/
				useAuth.js
			profile/
				useProfile.js
			useRoleAccess.js

		services/
			auth/
				authService.js
			profile/
				profileService.js

		lib/
			api/
				httpClient.js
			constants/
				roles.js
			validations/
				authValidations.js

		utils/
			index.js

		styles/
			themes/
				light.js
				dark.js
			index.css

		types/
			auth.types.js
			profile.types.js

		App.jsx
		main.jsx
		router.jsx
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
