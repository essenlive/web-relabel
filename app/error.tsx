'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center">
      <h1 className="text-4xl">Une erreur est survenue</h1>
      <p>Le chargement de cette page a échoué. Veuillez réessayer.</p>
      <button onClick={reset} className="border-4 border-primary px-4 py-2 font-bold uppercase cursor-pointer">Réessayer</button>
    </div>
  );
}
