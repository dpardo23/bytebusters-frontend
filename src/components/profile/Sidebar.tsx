import React from "react";
import { User, Globe, Briefcase, BookOpen, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { Section } from "../../types/profile.types";

interface SidebarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const getButtonClass = (section: Section) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors w-full text-left ${
      activeSection === section ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
    }`;

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="sticky top-8 space-y-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-indigo-200 hover:bg-indigo-50/40 hover:text-indigo-700"
          aria-label="Volver al inicio"
        >
          <ArrowLeft className="w-4 h-4" /> Inicio
        </Link>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 px-2">Configuracion</h2>
        <nav className="flex flex-col gap-1">
          <button onClick={() => setActiveSection('basic')} className={getButtonClass('basic')}>
            <User className="w-5 h-5" /> Informacion Basica
          </button>
          <button onClick={() => setActiveSection('public')} className={getButtonClass('public')}>
            <Globe className="w-5 h-5" /> Vista Publica
          </button>
          <button onClick={() => setActiveSection('experience')} className={getButtonClass('experience')}>
            <Briefcase className="w-5 h-5" /> Experiencia Laboral
          </button>
          <button onClick={() => setActiveSection('education')} className={getButtonClass('education')}>
            <BookOpen className="w-5 h-5" /> Educacion
          </button>
        </nav>
        </div>
      </div>
    </aside>
  );
}
