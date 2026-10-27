import { createContext, useContext } from "react";
import type { Account } from "@/lib/account-data";
import type { Application } from "@/lib/workspace-data";
type Resume = { file: File; url: string };
export type State = {
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  documentFiles: Record<string, { cv?: File; letter?: File }>;
  attachFile: (id: string, kind: "cv" | "letter", file: File) => void;
  applications: Application[];
  updateApplication: (id: string, patch: Partial<Application>) => void;
  saved: string[];
  toggleSaved: (id: string) => void;
  reviewed: string[];
  reviewJob: (id: string) => void;
  resume: Resume | null;
  setResume: (resume: Resume | null) => void;
};
export const Context = createContext<State | null>(null);

export function useWorkspace() {
  const state = useContext(Context);
  if (!state) throw Error("WorkspaceProvider is required");
  return state;
}
