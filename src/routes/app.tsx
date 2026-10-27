import { createFileRoute, Outlet } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
export const Route = createFileRoute("/app")({
  component: () => (
    <WorkspaceShell>
      <Outlet />
    </WorkspaceShell>
  ),
});
