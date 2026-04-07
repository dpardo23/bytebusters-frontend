import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface StatusData {
  status: string;
  statusMessage: string;
  relativeTime: string;
  isIncognito: boolean;
}

export function ProfileStatusBadge({ profileId }: { profileId: number }) {
  const [data, setData] = useState<StatusData | null>(null);

  useEffect(() => {
    // 2.1 Petición GET al endpoint (pasará por el proxy de Vite)
    fetch(`/api/profile/status/${profileId}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [profileId]);

  if (!data) return <div className="h-6 w-32 bg-gray-200 animate-pulse rounded-full" />;

  // 2.1.1 Lógica de filtrado: Si es incógnito, ocultamos detalles
  if (data.isIncognito) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium border border-gray-200 shadow-sm">
        ⚪ No Disponible
      </div>
    );
  }

  const isAvailable = data.status === 'A';

  return (
    <div className="flex flex-col gap-1 items-start">
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border shadow-sm ${
        isAvailable ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'
      }`}>
        {isAvailable ? '🟢 Disponible' : '🟠 Trabajando actualmente'}
        
        {/* Muestra el texto personalizado si existe */}
        {data.statusMessage && (
          <span className="pl-2 border-l border-current opacity-80 font-normal">
            {data.statusMessage}
          </span>
        )}
      </div>
      
      {/* 2.3 Tiempo relativo ("Activo hace X días") devuelto por el backend */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400 ml-2 mt-1">
        <Clock className="w-3.5 h-3.5" />
        {data.relativeTime}
      </div>
    </div>
  );
}