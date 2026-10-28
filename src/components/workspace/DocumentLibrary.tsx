import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
  type DragEvent,
} from "react";
import { Upload, FileText, Trash2, ExternalLink, RefreshCw } from "lucide-react";
import type { Resume } from "./useWorkspace";
import { RunningLoader } from "./RunningLoader";
import { usePreferences } from "@/components/preferences/usePreferences";
export function DocumentLibrary({
  title,
  description,
  inputLabel,
  files,
  setFiles,
  maxFiles = 3,
  formats = "documents",
}: {
  title: string;
  description?: string;
  inputLabel: string;
  files: Resume[];
  setFiles: Dispatch<SetStateAction<Resume[]>>;
  maxFiles?: number | null;
  formats?: "documents" | "supporting";
}) {
  const { t } = usePreferences();
  const extensions =
    formats === "supporting"
      ? ["pdf", "doc", "docx", "png", "jpg", "jpeg", "xls", "xlsx", "csv", "txt", "ics"]
      : ["pdf", "doc", "docx"];
  const input = useRef<HTMLInputElement>(null);
  const replacing = useRef<number | null>(null);
  const busy = useRef(false);
  const alive = useRef(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  async function upload(selected: File[]) {
    if (!selected.length || busy.current) return;
    setError("");
    setMessage("");
    const replace = replacing.current;
    if (
      (replace === null && maxFiles !== null && files.length + selected.length > maxFiles) ||
      (replace !== null && selected.length > 1)
    ) {
      setError(
        replace !== null
          ? t("Choisis un seul fichier pour le remplacement.", "Choose one replacement file.")
          : t(
              `${maxFiles} fichiers maximum dans cette catégorie. Supprime ou remplace un document.`,
              `Up to ${maxFiles} files per category. Remove or replace a document.`,
            ),
      );
      replacing.current = null;
      if (input.current) input.current.value = "";
      return;
    }
    busy.current = true;
    setLoading(true);
    try {
      for (const file of selected) {
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (!extensions.includes(ext ?? ""))
          throw Error(
            t(
              `Formats autorisés : ${extensions.join(", ").toUpperCase()}.`,
              `Allowed formats: ${extensions.join(", ").toUpperCase()}.`,
            ),
          );
        if (file.size === 0 || file.size > 10 * 1024 * 1024)
          throw Error(
            t(
              "Chaque document doit être non vide et ne pas dépasser 10 Mo.",
              "Each document must be non-empty and no larger than 10 MB.",
            ),
          );
        const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
        let valid = false;
        switch (ext) {
          case "pdf":
            valid = new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-";
            break;
          case "doc":
          case "xls":
            valid =
              bytes.length >= 8 &&
              bytes.every((b, i) => b === [208, 207, 17, 224, 161, 177, 26, 225][i]);
            break;
          case "docx":
          case "xlsx":
            valid = bytes[0] === 80 && bytes[1] === 75 && bytes[2] === 3 && bytes[3] === 4;
            break;
          case "png":
            valid =
              bytes.length >= 8 &&
              bytes.every((b, i) => b === [137, 80, 78, 71, 13, 10, 26, 10][i]);
            break;
          case "jpg":
          case "jpeg":
            valid = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
            break;
          case "csv":
          case "txt":
          case "ics": {
            const text = await file.text();
            valid = !text.includes("\u0000") && text.trim().length > 0;
            if (ext === "ics") valid = valid && text.trimStart().startsWith("BEGIN:VCALENDAR");
            break;
          }
        }
        if (!valid)
          throw Error(
            t(
              "Le contenu du fichier ne correspond pas au format annoncé.",
              "The file content does not match its declared format.",
            ),
          );
      }
      if (!alive.current) return;
      const next = selected.map((file) => ({ file, url: URL.createObjectURL(file) }));
      setFiles((xs) =>
        replace === null ? [...xs, ...next] : xs.map((r, i) => (i === replace ? next[0]! : r)),
      );
      setMessage(
        t(
          "Document(s) ajouté(s) à cette catégorie. Aucun envoi serveur.",
          "Document(s) added to this category. Nothing was sent to a server.",
        ),
      );
    } catch (e) {
      if (alive.current)
        setError(
          e instanceof Error
            ? e.message
            : t("Impossible de lire le fichier.", "Unable to read this file."),
        );
    } finally {
      busy.current = false;
      replacing.current = null;
      if (alive.current) setLoading(false);
      if (input.current) input.current.value = "";
    }
  }
  function drop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    replacing.current = null;
    void upload(Array.from(e.dataTransfer.files));
  }
  return (
    <section className="panel" aria-label={title}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">{title}</h2>
          {description && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>
        <span
          aria-label={`${title} : ${t("fichiers ajoutés", "files added")}`}
          className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary-text"
          aria-live="polite"
        >
          {maxFiles === null
            ? `${files.length} ${t(files.length > 1 ? "fichiers" : "fichier", files.length === 1 ? "file" : "files")}`
            : `${files.length}/${maxFiles}`}
        </span>
      </div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={drop}
        className={`rounded-[1.5rem] border-2 border-dashed px-5 py-10 text-center ${dragging ? "border-primary bg-primary/10" : "border-input bg-background/40"}`}
      >
        <Upload className="mx-auto text-primary-text" size={30} />
        <h3 className="mt-4 text-lg font-semibold">
          {t("Glisse tes fichiers ici", "Drop your files here")}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {formats === "supporting"
            ? "PDF · DOC · DOCX · PNG · JPG · XLS · XLSX · CSV · TXT · ICS"
            : "PDF · DOC · DOCX"}
          {" · "}
          {t("10 Mo par fichier", "10 MB per file")}
        </p>
        <button
          disabled={loading || (maxFiles !== null && files.length >= maxFiles)}
          onClick={() => {
            replacing.current = null;
            if (input.current) input.current.multiple = true;
            input.current?.click();
          }}
          className="btn-primary mt-5"
        >
          {t("Choisir des fichiers", "Choose files")}
        </button>
        <input
          ref={input}
          type="file"
          multiple
          accept={extensions.map((ext) => `.${ext}`).join(",")}
          aria-label={inputLabel}
          className="sr-only"
          onChange={(e) => void upload(Array.from(e.target.files ?? []))}
        />
      </div>
      {loading && <RunningLoader />}
      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="mt-4 text-sm text-primary-text">
          {message}
        </p>
      )}
      <ul className="mt-5 space-y-3">
        {files.map((r, i) => (
          <li key={r.url} className="flex flex-wrap items-center gap-3 rounded-2xl border p-4">
            <span className="rounded-xl bg-primary/10 p-3 text-primary-text">
              <FileText size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="break-all text-sm font-semibold">{r.file.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {Math.ceil(r.file.size / 1024)} {t("Ko", "KB")} ·{" "}
                {r.file.name.split(".").pop()?.toUpperCase()}
              </p>
            </div>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t("Ouvrir", "Open")} ${r.file.name}`}
              className="rounded-lg border p-2 text-primary-text"
            >
              <ExternalLink size={16} />
            </a>
            <button
              disabled={loading}
              onClick={() => {
                replacing.current = i;
                if (input.current) input.current.multiple = false;
                input.current?.click();
              }}
              aria-label={`${t("Remplacer", "Replace")} ${r.file.name}`}
              className="rounded-lg border p-2"
            >
              <RefreshCw size={16} />
            </button>
            <button
              disabled={loading}
              onClick={() => setFiles((xs) => xs.filter((_, index) => index !== i))}
              aria-label={`${t("Supprimer", "Delete")} ${r.file.name}`}
              className="rounded-lg border p-2 text-red-800"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
