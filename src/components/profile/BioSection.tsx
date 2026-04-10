import React from "react";

export function BioSection({ formData, onChange }: any) {
  return (
    <section className="p-8 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Sobre ti</h2>
      <div className="space-y-6">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Biografía *</label>
          <textarea 
            name="bio" 
            value={formData.bio} 
            onChange={onChange} 
            rows={6} 
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
          />
          <p className="text-[10px] text-gray-400 mt-1 ml-1">Mínimo 20 caracteres para un perfil profesional.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Estado *</label>
            <select name="status" value={formData.status} onChange={onChange} className="w-full px-4 py-3 border rounded-xl bg-white outline-none">
              <option value="active">Disponible</option>
              <option value="busy">Ocupado</option>
              <option value="incognito">Incógnito</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mensaje corto</label>
            <input name="statusMessage" value={formData.statusMessage} onChange={onChange} className="w-full px-4 py-3 border rounded-xl outline-none" />
          </div>
        </div>
      </div>
    </section>
  );
}