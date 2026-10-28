import { createFileRoute } from "@tanstack/react-router";
import { Overview } from "@/components/workspace/Overview";
export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Crétoria" }] }),
  component: Overview,
});
