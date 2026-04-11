import React from "react";
import { Plus, Trash2, Link2, ChevronDown } from "lucide-react";

const PLATFORMS = [
  { id: 1, name: "BEHANCE" }, { id: 2, name: "DRIBBBLE" },
  { id: 3, name: "EMAIL" }, { id: 4, name: "FACEBOOK" },
  { id: 5, name: "GITHUB" }, { id: 6, name: "INSTAGRAM" },
  { id: 7, name: "LINKEDIN" }, { id: 8, name: "PORTFOLIO" },
  { id: 9, name: "STACK_OVERFLOW" }, { id: 10, name: "TELEGRAM" },
  { id: 11, name: "TIKTOK" }, { id: 12, name: "TWITTER_X" },
  { id: 13, name: "WHATSAPP" }, { id: 14, name: "YOUTUBE" }
];

interface SocialLinkItem {
  sociallinksId?: number;
  plataformId: string | number;
  url: string;
}

interface SocialLinksProps {
  links: SocialLinkItem[];
  onChange: (links: SocialLinkItem[]) => void;
  isEditing: boolean;
}

export function SocialLinks({ links = [], onChange, isEditing }: SocialLinksProps) {
  
  const handleLinkChange = (index: number, field: keyof SocialLinkItem, value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange(newLinks);
  };

  const addLinkField = () => {
    const lastLink = links[links.length - 1];
    // Evita añadir otro campo vacío si el último ya está vacío
    if (!lastLink || (lastLink.plataformId && lastLink.url)) {
      onChange([...links, { plataformId: "", url: "" }]);
    }
  };

  const removeLinkField = (index: number) => {
    // Simplemente filtra y elimina, permitiendo que el array quede vacío []
    const newLinks = links.filter((_, i) => i !== index);
    onChange(newLinks);
  };

  return (
    <div className="space-y-4">
      {/* Mensaje si no hay links */}
      {links.length === 0 && !isEditing && (
        <p className="text-sm text-gray-500 italic">No hay redes sociales configuradas.</p>
      )}

      {links.map((link, index) => (
        <div key={index} className="flex flex-col md:flex-row gap-3 items-start p-3 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in">
          <div className="relative w-full md:w-1/3">
            <select
              disabled={!isEditing}
              value={link.plataformId}
              onChange={(e) => handleLinkChange(index, "plataformId", e.target.value)}
              className="w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100 text-sm font-medium"
            >
              <option value="">Seleccionar Red...</option>
              {PLATFORMS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative flex-1 w-full">
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Link2 className="w-4 h-4" />
            </div>
            <input
              type="url"
              disabled={!isEditing}
              value={link.url}
              onChange={(e) => handleLinkChange(index, "url", e.target.value)}
              placeholder="https://ejemplo.com"
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100 text-sm"
            />
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={() => removeLinkField(index)}
              className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      ))}

      {isEditing && (
        <button
          type="button"
          onClick={addLinkField}
          className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 p-2"
        >
          <Plus className="w-4 h-4" /> {links.length === 0 ? "Añadir red social" : "Añadir otra red social"}
        </button>
      )}
    </div>
  );
}