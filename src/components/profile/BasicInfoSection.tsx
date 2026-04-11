import React, { ChangeEvent, RefObject, useEffect, useRef, useState } from "react";
import { Camera, ChevronDown } from "lucide-react";
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
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  const statusOptions = [
    { value: "active", label: "Disponible para contratar", dotClass: "bg-green-400" },
    { value: "busy", label: "Trabajando actualmente", dotClass: "bg-orange-400" },
    { value: "incognito", label: "No disponible (Modo Incognito)", dotClass: "bg-purple-300" },
  ] as const;

  const selectedStatus = statusOptions.find((option) => option.value === formData.status) || statusOptions[0];

  useEffect(() => {
    if (!isEditing) {
      setIsStatusOpen(false);
    }
  }, [isEditing]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!statusDropdownRef.current) return;
      if (!statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleStatusSelect = (nextStatus: string) => {
    const syntheticEvent = {
      target: { name: 'status', value: nextStatus },
    } as ChangeEvent<HTMLInputElement | HTMLSelectElement>;
    handleChange(syntheticEvent);
    setIsStatusOpen(false);
  };

  return (
    <div className={`bg-white border rounded-xl shadow-sm transition-colors ${isEditing ? 'border-indigo-200 ring-1 ring-indigo-50' : 'border-gray-200'}`}>
      <div className="p-6 border-b border-gray-200 bg-gray-50/50">
        <h3 className="text-lg font-semibold text-gray-900">Informacion Basica</h3>
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
              className={`w-full px-3 py-2 border rounded-md outline-none transition-all ${!isEditing ? 'bg-gray-50 text-gray-600 border-transparent font-medium' : errors.name ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'}`}
            />
            {errors.name && isEditing && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Titular / Profesion</label>
            <input
              type="text" name="headline" value={formData.headline} onChange={handleChange} disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-md outline-none transition-all ${!isEditing ? 'bg-gray-50 text-gray-600 border-transparent font-medium' : errors.headline ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'}`}
            />
            {errors.headline && isEditing && <p className="text-red-500 text-xs">{errors.headline}</p>}
          </div>

          <div className="space-y-2 mt-2">
            <label className="block text-sm font-medium text-gray-700">Estado de Disponibilidad</label>
            <div className="relative" ref={statusDropdownRef}>
              <button
                type="button"
                disabled={!isEditing}
                onClick={() => setIsStatusOpen((prev) => !prev)}
                className={`w-full px-3 py-2 border rounded-xl outline-none transition-all text-left flex items-center justify-between ${!isEditing ? 'bg-gray-50 text-gray-600 border-transparent cursor-default font-medium' : 'bg-white border-gray-300 focus:ring-2 focus:ring-indigo-500'}`}
              >
                <span className="inline-flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${selectedStatus.dotClass}`} />
                  {selectedStatus.label}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} />
              </button>

              {isEditing && isStatusOpen ? (
                <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                  {statusOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        type="button"
                        onClick={() => handleStatusSelect(option.value)}
                        className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors inline-flex items-center gap-2 ${formData.status === option.value ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'}`}
                      >
                        <span className={`h-3 w-3 rounded-full ${option.dotClass}`} />
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
