/*import ProfileHeader from '../../components/profile/ProfileHeader'

export default function ProfilePage() {
  return (
    <main>
      <ProfileHeader name='Mi perfil' />
    </main>
  )
}*/

import React from 'react';
import useAuth from '../../hooks/auth/useAuth'; // Importación por defecto igual que en tu Navbar
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { ProfileEditForm } from '../../components/profile/ProfileEditForm';
import { ExperienceForm } from '../../components/profile/ExperienceForm';
import { EducationForm } from '../../components/profile/EducationForm';

export default function ProfilePage() {
  const { user } = useAuth(); // Extraemos al usuario de la sesión

  // Mientras carga la sesión, mostramos un pequeño texto
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 animate-pulse">Cargando perfil...</p>
      </div>
    );
  }

  return (
    // Agregamos pt-20 (padding-top) para que el Navbar fijo no tape tu cabecera
    <div className="min-h-screen bg-gray-50 pb-20 pt-20"> 
      
      {/* 1. Cabecera del Perfil */}
      <ProfileHeader user={user} />
      
      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-6">
        
        {/* 2. Edición de Información Básica y Redes */}
        <ProfileEditForm initialUser={user} />
        
        {/* 3. Formularios de Experiencia y Educación (Mateo) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExperienceForm />
          <EducationForm />
        </div>

      </div>
    </div>
  );
}