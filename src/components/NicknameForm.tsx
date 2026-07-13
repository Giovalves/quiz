import { useState } from "react";

export function NicknameForm({
  onSave,
  saved,
  saving,
  error,
}: {
  onSave: (nickname: string) => void;
  saved: boolean;
  saving: boolean;
  error: string | null;
}) {
  const [nickname, setNickname] = useState("");

  if (saved) {
    return <p className="text-sm font-medium text-success">Resultado salvo no ranking!</p>;
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = nickname.trim();
        if (trimmed) onSave(trimmed);
      }}
      className="flex flex-col gap-2"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label htmlFor="nickname" className="sr-only">
          Seu nickname
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="Seu nickname"
          maxLength={20}
          disabled={saving}
          className="rounded-lg border border-primary-light bg-white px-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!nickname.trim() || saving}
          className="rounded-lg bg-primary px-5 py-2 font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar resultado"}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
    </form>
  );
}
