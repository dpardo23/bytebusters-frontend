/*import GuestProfileView from '../../components/profile/GuestProfileView'

export default function PublicProfilePage() {
  return (
    <main>
      <GuestProfileView />
    </main>
  )
}*/

import React from 'react';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { CareerTimeline } from '../../components/profile/CareerTimeline';
import { EducationSection } from '../../components/profile/EducationSection';
import { GuestProfileView } from '../../components/profile/GuestProfileView';

export default function PublicProfilePage() {
  const isGuestMode = true;
  
  const mockUser = { name: "Mauricio Jaimes", headline: "Frontend Developer", isGuest: isGuestMode };
  const mockExperiences = [];
  const mockEducation = []; 

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-6">
      <GuestProfileView isGuest={isGuestMode} />
      <ProfileHeader user={mockUser} />
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <CareerTimeline experiences={mockExperiences} isGuest={isGuestMode} />
        <EducationSection education={mockEducation} />
      </div>
    </div>
  );
}