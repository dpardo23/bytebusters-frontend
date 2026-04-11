import React, { useState, ChangeEvent, useRef, useEffect } from "react"
import { Loader2, CloudUpload, CheckCircle2, Edit3, X } from "lucide-react"

import type { ExtendedUserData, Section } from "../../types/profile.types"
import { Sidebar } from "./Sidebar"
import { BasicInfoSection } from "./BasicInfoSection"
import { PublicViewSection } from "./PublicViewSection"
import { ExperienceForm } from "./ExperienceForm" 
import { EducationForm } from "./EducationForm"   

interface ProfileEditFormProps {
  initialUser: ExtendedUserData;
}

export function ProfileEditForm({ initialUser }: ProfileEditFormProps) {
  const [activeSection, setActiveSection] = useState<Section>('basic');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  
  const [originalData, setOriginalData] = useState<ExtendedUserData>(initialUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExtendedUserData>(initialUser);

  // Efecto para cargar datos (se mantiene igual)
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const currentUserId = initialUser.id; 
        if (!currentUserId) {
          setIsLoadingData(false);
          return;
        }

        const [statusRes, bioRes, heroRes] = await Promise.all([
          fetch(`/api/profile/status/${currentUserId}`),
          fetch(`/api/biography/${currentUserId}`),
          fetch(`/api/profile/hero-section/${currentUserId}`) 
        ]);

        let loadedData = { ...initialUser };

        if (statusRes.ok) {
          const statusData = await statusRes.json();
          loadedData.status = statusData.status === 'A' ? 'active' : statusData.status === 'B' ? 'busy' : 'incognito';
          loadedData.statusMessage = statusData.statusMessage || "";
        }

        if (bioRes.ok) {
          loadedData.bio = await bioRes.text();
        }

        if (heroRes.ok) {
          const heroData = await heroRes.json();
          loadedData.name = heroData.name || "";
          loadedData.headline = heroData.headline || "";
          if (heroData.photoBase64) setPhotoPreview(heroData.photoBase64);
        }

        setFormData(loadedData);
        setOriginalData(loadedData);
      } catch (error) {
        console.error("Error al cargar:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchProfileData();
  }, [initialUser]);

  // Manejadores (se mantienen igual)
  const handleCancelEdit = () => {
    setFormData(originalData);
    setPhotoFile(null);
    setPhotoPreview(originalData.photoBase64 || null);
    setErrors({});
    setIsEditing(false);
  }

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSave = async () => {
    setIsLoading(true);
    // ... tu lógica de save se mantiene igual ...
    setIsLoading(false);
    setIsEditing(false);
  }

  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Cargando tu perfil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 mb-20 flex flex-col md:flex-row gap-8 px-4">
      
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <main className="flex-1 min-w-0 flex flex-col">
        {errors.global && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{errors.global}</div>}
        {successMessage && <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" />{successMessage}</div>}

        {/* CONTENEDOR DE SECCIONES */}
        <div className="space-y-6 flex-1">
          {activeSection === 'basic' && (
            <BasicInfoSection 
              formData={formData} isEditing={isEditing} errors={errors} handleChange={handleChange} 
              fileInputRef={fileInputRef} handlePhotoChange={handlePhotoChange} photoPreview={photoPreview} 
            />
          )}

          {activeSection === 'public' && (
            <PublicViewSection 
              formData={formData} isEditing={isEditing} isSavingDraft={isSavingDraft} handleChange={handleChange} 
            />
          )}

          {activeSection === 'experience' && (
            <ExperienceForm 
              profileId={initialUser.id} isEditingProfile={true} 
            />
          )}
            
          {activeSection === 'education' && (
            <EducationForm 
              profileId={initialUser.id} 
              isEditingProfile={true} 
            />
          )}
        </div> {/* <--- AQUÍ FALTABA CERRAR ESTE DIV */}

        {/* BOTONES DE ACCIÓN (FOOTER) */}
        {(activeSection === 'basic' || activeSection === 'public') && (
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm">
                <Edit3 className="w-4 h-4" /> Editar Perfil
              </button>
            ) : (
              <>
                <button onClick={handleCancelEdit} disabled={isLoading} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all">
                  <X className="w-4 h-4" /> Cancelar
                </button>
                <button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all shadow-sm disabled:opacity-50">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
                  Guardar Cambios
                </button>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}