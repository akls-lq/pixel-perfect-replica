import { Context } from "./useWorkspace";
import { accountSamples } from "@/lib/account-data";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { initialApplications } from "@/lib/workspace-data";
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState(accountSamples);
  const [documentFiles, setDocumentFiles] = useState<Record<string, { cv?: File; letter?: File }>>(
    {},
  );
  const [applications, setApplications] = useState(initialApplications);
  const [saved, setSaved] = useState<string[]>([]);
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [resumes, setResumes] = useState<{ file: File; url: string }[]>([]);
  const urls = useRef(new Set<string>());
  useEffect(() => {
    const current = new Set(resumes.map((r) => r.url));
    for (const url of urls.current) if (!current.has(url)) URL.revokeObjectURL(url);
    urls.current = current;
  }, [resumes]);
  useEffect(
    () => () => {
      for (const url of urls.current) URL.revokeObjectURL(url);
    },
    [],
  );
  const resume = resumes[0] ?? null;
  const setResume = (next: { file: File; url: string } | null) =>
    setResumes((xs) => (next ? [next, ...xs.slice(1)] : xs.slice(1)));
  return (
    <Context.Provider
      value={{
        accounts,
        setAccounts,
        documentFiles,
        attachFile: (id, kind, file) =>
          setDocumentFiles((d) => ({ ...d, [id]: { ...d[id], [kind]: file } })),
        applications,
        updateApplication: (id, patch) =>
          setApplications((xs) => xs.map((a) => (a.id === id ? { ...a, ...patch } : a))),
        saved,
        toggleSaved: (id) =>
          setSaved((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id])),
        reviewed,
        reviewJob: (id) => setReviewed((xs) => (xs.includes(id) ? xs : [...xs, id])),
        resumes,
        setResumes,
        resume,
        setResume,
      }}
    >
      {children}
    </Context.Provider>
  );
}
