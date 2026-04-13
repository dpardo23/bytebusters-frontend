import React, { ChangeEvent } from "react";
import { FileText, Loader2 } from "lucide-react";
import type { ExtendedUserData } from "../../types/profile.types";

interface PublicViewSectionProps {
  formData: ExtendedUserData;
  isEditing: boolean;
  isSavingDraft: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function PublicViewSection({ formData, isEditing, isSavingDraft, handleChange }: PublicViewSectionProps) {
  const bioLimit = 500;
  const bioCharsLeft = bioLimit - (formData.bio?.length || 0);

  return (
    <div className={`bg-white border rounded-xl shadow-sm overflow-hidden text-left transition-colors ${isEditing ? 'border-indigo-200 ring-1 ring-indigo-50' : 'border-gray-200'}`}>
      <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Sobre mi</h3>
        </div>
        {isSavingDraft && isEditing && (
          <span className="text-xs text-gray-400 italic flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" /> Guardando borrador...
          </span>
        )}
      </div>
      <div className="p-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Resumen Profesional</label>
          <textarea
            name="bio" 
            value={formData.bio || ""}
            onChange={handleChange} 
            disabled={!isEditing} 
            rows={5} 
            maxLength={bioLimit} 
            placeholder={isEditing ? "Cuéntanos sobre ti..." : "Sin información"}
            className={`w-full px-3 py-2 border rounded-md outline-none resize-none transition-all ${!isEditing ? 'bg-gray-50 text-gray-600 border-transparent' : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'}`}
          />
          {isEditing && (
            <p className={`text-[11px] text-right font-medium ${bioCharsLeft <= 50 ? 'text-red-500' : 'text-gray-400'}`}>
              {bioCharsLeft} caracteres restantes
            </p>
          )}
        </div>
      </div>
    </div>
  );
}