'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error('Admin Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-red-600">Error del Admin</h1>
        <p className="text-xl text-muted-foreground">Algo salió mal en el panel de administración</p>
        <p className="text-sm text-muted-foreground max-w-md">
          {error.message || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
          <Link
            href="/admin/dashboard"
            className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-600/10 transition-colors"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
