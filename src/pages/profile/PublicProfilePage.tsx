import React from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/auth/useAuth';

import { ProfileEditForm } from '../../components/profile/ProfileEditForm'; 

export default function PublicProfilePage() {
  const { user } = useAuth();
  const { id } = useParams();

  if (!user) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='animate-pulse text-gray-500'>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-6">
      
      <ProfileEditForm initialUser={user} />
      
    </div>
  );
}