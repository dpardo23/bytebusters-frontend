import { useEffect, useState } from "react";
import { UserPlus, X } from "lucide-react";

interface GuestConversionProps {
  isGuest: boolean;
}

export function GuestConversion({ isGuest }: GuestConversionProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState<boolean>(true);

  useEffect(() => {
    if (isGuest) {
      const timer = setTimeout(() => setShowModal(true), 30000);
      return () => clearTimeout(timer);
    }
  }, [isGuest]);

  if (!isGuest) return null;

  return (
    <>
      {/* Modal automático */}
      {showModal && (
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
      )}

      {/* Banner sticky inferior */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-2xl z-40 flex flex-col md:flex-row items-center justify-between gap-4 px-8 border-t border-gray-800">
          <p className="text-sm font-medium">Estás navegando en modo invitado. Crea tu perfil para acceder a todas las funciones.</p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowBanner(false)}
              className="text-gray-400 hover:text-white px-3 py-2 text-sm"
            >
              Cerrar
            </button>
            <button className="bg-white text-gray-900 px-5 py-2 rounded-md text-sm font-bold hover:bg-gray-100">
              Registrarse
            </button>
          </div>
        </div>
      )}
    </>
  );
}