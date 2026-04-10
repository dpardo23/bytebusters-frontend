import React, { ChangeEvent, RefObject } from "react";
import { Camera } from "lucide-react";
import type { ExtendedUserData } from "../../types/profile.types";

interface BasicInfoSectionProps {
  formData: ExtendedUserData;
  isEditing: boolean;
  errors: Record<string, string | null>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  fileInputRef: RefObject<HTMLInputElement>;
  handlePhotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
  photoPreview: string | null;
}

export function BasicInfoSection({
  formData, isEditing, errors, handleChange, fileInputRef, handlePhotoChange, photoPreview
}: BasicInfoSectionProps) {
  const statusMessageCharsLeft = 50 - (formData.statusMessage?.length || 0);

  return (
    <div className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-colors ${isEditing ? 'border-blue-200 ring-1 ring-blue-50' : 'border-gray-200'}`}>
      <div className="p-6 border-b border-gray-200 bg-gray-50/50">
        <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
      </div>
      <div className="p-6 space-y-6 text-left">
        
        <div className="flex items-center gap-6">
          <input 
            type="file" ref={fileInputRef} onChange={handlePhotoChange} 
            accept=".jpg,.jpeg,.png,.webp" className="hidden" disabled={!isEditing}
          />
          <button 
            type="button"
            onClick={() => isEditing && fileInputRef.current?.click()}
            disabled={!isEditing}
            className={`w-20 h-20 rounded-full flex items-center justify-center border-2 border-dashed overflow-hidden shrink-0 
              ${isEditing ? 'bg-gray-100 border-gray-300 hover:bg-gray-200 cursor-pointer' : 'bg-gray-50 border-gray-200 cursor-default'}`}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Camera className={`w-6 h-6 ${isEditing ? 'text-gray-400' : 'text-gray-300'}`} />
            )}
          </button>
          {isEditing && (
            <div className="flex flex-col">
              <p className="text-sm text-gray-500 text-left">Sube una foto cuadrada (JPG, PNG, WebP) de hasta 5MB.</p>
              {errors.photo && <span className="text-red-500 text-xs mt-1">{errors.photo}</span>}
            </div>
          )}
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nombre Completo {isEditing && <span className="text-red-500">*</span>}</label>
            <input
              type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-md outline-none transition-all ${!isEditing ? 'bg-gray-50 text-gray-600 border-transparent font-medium' : errors.name ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
            />
            {errors.name && isEditing && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Titular / Profesión</label>
            <input
              type="text" name="headline" value={formData.headline} onChange={handleChange} disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-md outline-none transition-all ${!isEditing ? 'bg-gray-50 text-gray-600 border-transparent font-medium' : errors.headline ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
            />
            {errors.headline && isEditing && <p className="text-red-500 text-xs">{errors.headline}</p>}
          </div>

          <div className="space-y-2 mt-2">
            <label className="block text-sm font-medium text-gray-700">Estado de Disponibilidad</label>
            <select
              name="status" value={formData.status} onChange={handleChange} disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-md outline-none transition-all ${!isEditing ? 'bg-gray-50 text-gray-600 border-transparent appearance-none font-medium' : 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
            >
              <option value="active">🟢 Disponible para contratar</option>
              <option value="busy">🟠 Trabajando actualmente</option>
              <option value="incognito">⚪ No disponible (Modo Incógnito)</option>
            </select>
          </div>

          {(isEditing || formData.statusMessage) && (
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-gray-700">Mensaje de Estado</label>
              <input
                type="text" name="statusMessage" value={formData.statusMessage} onChange={handleChange} disabled={!isEditing} placeholder="Ej: Buscando nuevos retos en React..."
                className={`w-full px-3 py-2 border rounded-md outline-none transition-all ${!isEditing ? 'bg-gray-50 text-gray-600 border-transparent italic' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm'}`}
              />
              {isEditing && (
                <p className={`text-[11px] text-right font-medium ${statusMessageCharsLeft <= 10 ? 'text-red-500' : 'text-gray-400'}`}>
                  {statusMessageCharsLeft} caracteres restantes
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}