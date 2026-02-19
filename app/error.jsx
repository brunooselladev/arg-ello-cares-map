'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">Oops!</h1>
        <p className="text-xl text-muted-foreground">Algo salió mal</p>
        <p className="text-sm text-muted-foreground max-w-md">
          {error.message || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
