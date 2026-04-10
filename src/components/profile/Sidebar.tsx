import React from "react";
import { User, Globe, Briefcase, BookOpen } from "lucide-react";
import type { Section } from "../../types/profile.types";

interface SidebarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const getButtonClass = (section: Section) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors w-full text-left ${
      activeSection === section ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
    }`;

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="sticky top-8 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 px-2">Configuración</h2>
        <nav className="flex flex-col gap-1">
          <button onClick={() => setActiveSection('basic')} className={getButtonClass('basic')}>
            <User className="w-5 h-5" /> Información Básica
          </button>
          <button onClick={() => setActiveSection('public')} className={getButtonClass('public')}>
            <Globe className="w-5 h-5" /> Vista Pública
          </button>
          <button onClick={() => setActiveSection('experience')} className={getButtonClass('experience')}>
            <Briefcase className="w-5 h-5" /> Experiencia Laboral
          </button>
          <button onClick={() => setActiveSection('education')} className={getButtonClass('education')}>
            <BookOpen className="w-5 h-5" /> Educación
          </button>
        </nav>
      </div>
    </aside>
  );
}