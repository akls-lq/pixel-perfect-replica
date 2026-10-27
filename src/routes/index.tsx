import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { Overview } from "@/components/workspace/Overview";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Mon tableau de bord — Crétoria" }] }),
  component: () => (
    <WorkspaceShell>
      <Overview />
    </WorkspaceShell>
  ),
});
