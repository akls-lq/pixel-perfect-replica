import { usePreferences } from "@/components/preferences/usePreferences";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
export function DocumentPreview({
  file,
  example,
  label,
}: {
  file: File | undefined;
  example: string;
  label: string;
}) {
  const { t } = usePreferences();
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    setText("");
    setError("");
    if (!file) {
      setUrl("");
      return;
    }
    const pdf = file.name.toLowerCase().endsWith(".pdf");
    const href = URL.createObjectURL(
      new Blob([file], { type: pdf ? "application/pdf" : "text/plain;charset=utf-8" }),
    );
    setUrl(href);
    if (!pdf)
      file
        .text()
        .then((t) => {
          if (!cancelled) setText(t);
        })
        .catch(() => {
          if (!cancelled)
            setError(
              t(
                "Aperçu texte indisponible. Tu peux télécharger le fichier.",
                "Text preview unavailable. You can download the file.",
              ),
            );
        });
    return () => {
      cancelled = true;
      URL.revokeObjectURL(href);
    };
  }, [file, t]);
  return (
    <details className="mt-3 rounded-lg bg-background p-3 text-xs">
      <summary className="cursor-pointer font-bold text-primary-text">
        {t("Consulter", "View")}
        {label}
      </summary>
      {!file ? (
        <pre className="mt-3 whitespace-pre-wrap font-sans leading-relaxed">{example}</pre>
      ) : (
        <div className="mt-3">
          {file.name.toLowerCase().endsWith(".txt") && (
            <pre className="max-h-72 overflow-y-auto whitespace-pre-wrap break-words font-sans leading-relaxed">
              {text || (!error ? t("Chargement de l’aperçu…", "Loading preview…") : "")}
            </pre>
          )}
          {error && <p role="alert">{error}</p>}
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 font-bold text-primary-text"
            >
              {t("Ouvrir le document local", "Open local document")}
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      )}
    </details>
  );
}
