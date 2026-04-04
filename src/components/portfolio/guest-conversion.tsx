import { useEffect, useState } from "react";
import { UserPlus, X } from "lucide-react";

interface GuestConversionProps {
  isGuest: boolean;
}

export function GuestConversion({ isGuest }: GuestConversionProps) {
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (isGuest) {
      const timer = setTimeout(() => setShowModal(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isGuest]);

  if (!isGuest || !showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡No te pierdas nada!</h2>
        <p className="text-gray-600 mb-6">Regístrate para ver el perfil completo y conectar con más profesionales.</p>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-blue-200">
          Crear cuenta gratis
        </button>
      </div>
    </div>
  );
}