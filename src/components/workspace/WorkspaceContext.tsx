import { Context } from "./useWorkspace";
import { accountSamples } from "@/lib/account-data";
import { useEffect, useState, type ReactNode } from "react";
import { initialApplications } from "@/lib/workspace-data";
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState(accountSamples);
  const [documentFiles, setDocumentFiles] = useState<Record<string, { cv?: File; letter?: File }>>(
    {},
  );
  const [applications, setApplications] = useState(initialApplications);
  const [saved, setSaved] = useState<string[]>([]);
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [resume, setResume] = useState<{ file: File; url: string } | null>(null);
  useEffect(
    () => () => {
      if (resume) URL.revokeObjectURL(resume.url);
    },
    [resume],
  );
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
        resume,
        setResume,
      }}
    >
      {children}
    </Context.Provider>
  );
}
