"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-lg font-medium text-error">Algo deu errado.</p>
      <p className="text-sm text-foreground/70">Tente novamente ou volte para a Home.</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-primary px-5 py-2 font-medium text-white transition hover:bg-primary-dark"
        >
          Tentar novamente
        </button>
        <Link
          href="/"
          className="rounded-lg border border-primary px-5 py-2 font-medium text-primary-dark transition hover:bg-primary-light"
        >
          Voltar à Home
        </Link>
      </div>
    </main>
  );
}
