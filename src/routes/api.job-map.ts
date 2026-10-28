import { createFileRoute } from "@tanstack/react-router";
import { loadMapFeed } from "@/lib/job-sources.server";
import type { MapFeed } from "@/lib/map-data";

const cache = new Map<string, { expires: number; value: Promise<MapFeed> }>();
export const Route = createFileRoute("/api/job-map")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const params = new URL(request.url).searchParams;
        const q = (params.get("q") ?? "").trim().slice(0, 100);
        const commune = /^\d{5}$/.test(params.get("commune") ?? "") ? params.get("commune")! : "";
        const key = JSON.stringify([q, commune]);
        let entry = cache.get(key);
        if (!entry || entry.expires <= Date.now()) {
          if (cache.size >= 100) cache.delete(cache.keys().next().value!);
          entry = { expires: Date.now() + 5 * 60_000, value: loadMapFeed({ q, commune }) };
          cache.set(key, entry);
        }
        try {
          return Response.json(await entry.value, {
            headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
          });
        } catch {
          cache.delete(key);
          return Response.json({ error: "Job sources unavailable" }, { status: 502 });
        }
      },
    },
  },
});
