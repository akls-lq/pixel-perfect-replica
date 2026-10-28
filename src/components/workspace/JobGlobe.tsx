import { useEffect, useRef, useState } from "react";
import { Globe2, LocateFixed, Minus, Plus } from "lucide-react";
import type { Map as LibreMap, Marker, GeoJSONSource, StyleSpecification } from "maplibre-gl";
import type { FeatureCollection, LineString, Point } from "geojson";
import type { MapBounds, MapOffer } from "@/lib/map-data";
import { usePreferences } from "@/components/preferences/usePreferences";
import "maplibre-gl/dist/maplibre-gl.css";
import "./JobGlobe.css";

export type MapFocus = { coordinates: [number, number]; zoom: number; revision: number };
function graticule(): FeatureCollection<LineString> {
  const lines: number[][][] = [];
  for (let lat = -60; lat <= 60; lat += 30)
    lines.push(Array.from({ length: 181 }, (_, i) => [-180 + i * 2, lat]));
  for (let lng = -180; lng < 180; lng += 30)
    lines.push(Array.from({ length: 85 }, (_, i) => [lng, -84 + i * 2]));
  return {
    type: "FeatureCollection",
    features: lines.map((coordinates) => ({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates },
    })),
  };
}
function style(): StyleSpecification {
  return {
    version: 8,
    glyphs: "/maps/fonts/{fontstack}/{range}.pbf",
    projection: {
      type: ["interpolate", ["linear"], ["zoom"], 2, "vertical-perspective", 6, "mercator"],
    },
    sky: {
      "sky-color": "#080f20",
      "horizon-color": "#637aca",
      "fog-color": "#172946",
      "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 0, 0.7, 5, 0],
    },
    sources: {
      countries: { type: "geojson", data: "/maps/countries.geojson", tolerance: 0.5 },
      grid: { type: "geojson", data: graticule() },
      cities: { type: "geojson", data: "/maps/cities.geojson" },
      rivers: { type: "geojson", data: "/maps/rivers.geojson" },
      departments: { type: "geojson", data: "/maps/france.geojson" },
    },
    layers: [
      { id: "ocean", type: "background", paint: { "background-color": "#152642" } },
      {
        id: "land",
        type: "fill",
        source: "countries",
        paint: {
          "fill-color": "#2e4565",
          "fill-opacity": 1,
        },
      },
      {
        id: "borders",
        type: "line",
        source: "countries",
        paint: {
          "line-color": "#607797",
          "line-width": 0.6,
          "line-opacity": 0.65,
        },
      },
      {
        id: "grid",
        type: "line",
        source: "grid",
        paint: {
          "line-color": "#91a5d1",
          "line-width": 0.5,
          "line-opacity": ["interpolate", ["linear"], ["zoom"], 1, 0.16, 5, 0],
        },
      },
      {
        id: "departments",
        type: "line",
        source: "departments",
        minzoom: 5,
        paint: { "line-color": "#7388a3", "line-width": 0.8, "line-opacity": 0.7 },
      },
      {
        id: "rivers",
        type: "line",
        source: "rivers",
        minzoom: 4,
        paint: {
          "line-color": "#729ecb",
          "line-width": ["interpolate", ["linear"], ["zoom"], 4, 0.7, 10, 2],
        },
      },
      {
        id: "city-dots",
        type: "circle",
        source: "cities",
        minzoom: 5,
        paint: { "circle-color": "#c2d0e7", "circle-radius": 2 },
      },
      {
        id: "city-labels",
        type: "symbol",
        source: "cities",
        minzoom: 2,
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Semibold"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 2, 10, 8, 13],
          "text-anchor": "top",
          "text-offset": [0, 0.6],
          "symbol-sort-key": ["get", "rank"],
          "text-max-width": 8,
          "text-padding": 8,
        },
        paint: { "text-color": "#e3ebf9", "text-halo-color": "#243956", "text-halo-width": 1.5 },
      },
    ],
  };
}
function offerPoints(offers: MapOffer[]): FeatureCollection<Point> {
  return {
    type: "FeatureCollection",
    features: offers
      .filter((o) => o.coordinates)
      .map((o) => ({
        type: "Feature",
        properties: { offerId: o.id, title: o.title },
        geometry: { type: "Point", coordinates: o.coordinates! },
      })),
  };
}
export function JobGlobe({
  offers,
  focus,
  onSelect,
  onViewport,
}: {
  offers: MapOffer[];
  focus: MapFocus | null;
  onSelect: (id: string) => void;
  onViewport: (bounds: MapBounds, center: [number, number]) => void;
}) {
  const { t, language } = usePreferences();
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LibreMap | null>(null);
  const latest = useRef({ offers, onSelect, onViewport, language });
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [tiles, setTiles] = useState(true);
  const [tileError, setTileError] = useState(false);
  const [zoom, setZoom] = useState(1.25);
  useEffect(() => {
    latest.current = { offers, onSelect, onViewport, language };
  }, [offers, onSelect, onViewport, language]);
  useEffect(() => {
    let cancelled = false;
    let instance: LibreMap | undefined;
    let observer: ResizeObserver | undefined;
    const markers = new Map<string, Marker>();
    void import("maplibre-gl")
      .then((lib) => {
        if (cancelled || !container.current) return;
        instance = new lib.Map({
          container: container.current,
          style: style(),
          center: [6, 28],
          zoom: container.current.clientWidth < 500 ? 0.85 : 1.25,
          minZoom: 0,
          maxZoom: 16,
          attributionControl: false,
          pitchWithRotate: false,
          dragRotate: false,
          maxPitch: 0,
          renderWorldCopies: false,
          canvasContextAttributes: { antialias: true },
        });
        const m = instance;
        map.current = m;
        m.touchZoomRotate.disableRotation();
        m.getCanvas().setAttribute("aria-label", "Carte interactive · Interactive map");
        m.on("error", (event) => {
          if (cancelled) return;
          const sourceId = "sourceId" in event ? event.sourceId : "";
          if (sourceId === "streets") setTileError(true);
          else if (sourceId === "countries") setFailed(true);
        });
        const viewport = () => {
          if (cancelled) return;
          const b = m.getBounds(),
            c = m.getCenter();
          latest.current.onViewport(
            { west: b.getWest(), east: b.getEast(), south: b.getSouth(), north: b.getNorth() },
            [c.lng, c.lat],
          );
          setZoom(m.getZoom());
        };
        function updateMarkers() {
          if (cancelled || !m.isSourceLoaded("offers")) return;
          const visible = new Set<string>();
          for (const feature of m.querySourceFeatures("offers")) {
            if (feature.geometry.type !== "Point") continue;
            const props = feature.properties ?? {};
            const cluster = !!props["cluster"];
            const id = cluster ? `cluster-${props["cluster_id"]}` : String(props["offerId"]);
            if (visible.has(id)) continue;
            visible.add(id);
            const position = feature.geometry.coordinates as [number, number];
            const version = JSON.stringify([
              position,
              props["point_count"],
              props["title"],
              latest.current.language,
            ]);
            const existing = markers.get(id);
            if (existing?.getElement().dataset["version"] === version) continue;
            existing?.remove();
            const button = document.createElement("button");
            button.type = "button";
            button.dataset["version"] = version;
            button.className = `job-map-marker ${cluster ? "job-map-cluster" : ""}`;
            button.textContent = cluster ? String(props["point_count_abbreviated"]) : "1";
            button.setAttribute(
              "aria-label",
              cluster
                ? `${props["point_count"]} ${latest.current.language === "fr" ? "offres dans cette zone, zoomer" : "jobs in this area, zoom in"}`
                : String(props["title"]),
            );
            button.title = button.getAttribute("aria-label")!;
            button.addEventListener("click", (event) => {
              event.stopPropagation();
              if (cluster) {
                void (m.getSource("offers") as GeoJSONSource)
                  .getClusterExpansionZoom(Number(props["cluster_id"]))
                  .then((nextZoom) => {
                    if (!cancelled) m.easeTo({ center: position, zoom: nextZoom + 0.2 });
                  })
                  .catch(() => {});
              } else latest.current.onSelect(String(props["offerId"]));
            });
            markers.set(
              id,
              new lib.Marker({ element: button, opacityWhenCovered: 0 })
                .setLngLat(position)
                .addTo(m),
            );
          }
          for (const [id, marker] of markers)
            if (!visible.has(id)) {
              marker.remove();
              markers.delete(id);
            }
        }
        m.on("load", () => {
          if (cancelled) return;
          m.addSource("offers", {
            type: "geojson",
            data: offerPoints(latest.current.offers),
            cluster: true,
            clusterRadius: 48,
            clusterMaxZoom: 13,
          });
          m.addLayer({
            id: "offer-points",
            type: "circle",
            source: "offers",
            paint: { "circle-radius": 1, "circle-opacity": 0 },
          });
          m.on("render", updateMarkers);
          viewport();
          setReady(true);
        });
        m.on("moveend", viewport);
        observer = new ResizeObserver(() => m.resize());
        observer.observe(container.current);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      observer?.disconnect();
      for (const marker of markers.values()) marker.remove();
      instance?.remove();
      map.current = null;
    };
  }, []);
  useEffect(() => {
    if (ready)
      (map.current?.getSource("offers") as GeoJSONSource | undefined)?.setData(offerPoints(offers));
  }, [offers, ready]);
  useEffect(() => {
    if (ready && focus)
      map.current?.flyTo({ center: focus.coordinates, zoom: focus.zoom, duration: 1200 });
  }, [focus, ready]);
  useEffect(() => {
    const m = map.current;
    if (!ready || !m) return;
    if (tiles && !m.getSource("streets")) {
      m.addSource("streets", {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        maxzoom: 19,
      });
      m.addLayer({ id: "streets", type: "raster", source: "streets", minzoom: 4 }, "offer-points");
    }
    if (m.getLayer("streets"))
      m.setLayoutProperty("streets", "visibility", tiles && !tileError ? "visible" : "none");
  }, [tiles, ready, tileError]);
  return (
    <div
      className="job-globe"
      data-map-ready={ready}
      data-map-view={zoom >= 6 ? "flat" : zoom <= 2 ? "globe" : "transition"}
    >
      <div ref={container} className="job-globe-canvas" />
      {!ready && !failed && (
        <div className="job-map-loading" role="status">
          {t("Chargement du globe…", "Loading globe…")}
        </div>
      )}
      {failed && (
        <div className="job-map-loading" role="status">
          {t(
            "La carte ne peut pas s’afficher. La liste des offres reste accessible à côté.",
            "The map could not load. You can still use the job list alongside it.",
          )}
        </div>
      )}
      <div className="job-map-mode">
        <Globe2 size={13} />
        {zoom >= 6 ? t("Vue carte", "Map view") : t("Vue globe", "Globe view")}
      </div>
      <div className="job-map-controls" aria-label={t("Commandes de la carte", "Map controls")}>
        <button
          type="button"
          disabled={!ready || zoom >= 16}
          aria-label={t("Zoomer", "Zoom in")}
          onClick={() => map.current?.zoomIn()}
        >
          <Plus size={19} />
        </button>
        <button
          type="button"
          disabled={!ready || zoom <= 0}
          aria-label={t("Dézoomer", "Zoom out")}
          onClick={() => map.current?.zoomOut()}
        >
          <Minus size={19} />
        </button>
        <button
          type="button"
          disabled={!ready}
          aria-label={t("Revenir au globe", "Reset globe")}
          onClick={() =>
            map.current?.flyTo({
              center: [6, 28],
              zoom: (map.current?.getContainer().clientWidth ?? 800) < 500 ? 0.85 : 1.25,
              duration: 1200,
            })
          }
        >
          <LocateFixed size={19} />
        </button>
      </div>
      <div className="job-map-bottom">
        <span>
          {t(
            "Maintiens le clic gauche pour explorer",
            "Drag with the left mouse button to explore",
          )}
        </span>
        <label>
          <input
            type="checkbox"
            checked={tiles}
            onChange={(e) => {
              setTileError(false);
              setTiles(e.target.checked);
            }}
          />
          {t("Rues", "Streets")}
        </label>
      </div>
      {tileError && (
        <p className="job-map-tile-error" role="status">
          {t(
            "Fond de rues indisponible · Le fond local reste affiché",
            "Street tiles unavailable · Showing the local map",
          )}
        </p>
      )}
      <div className="job-map-attribution">
        MapLibre ·{" "}
        <a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">
          Natural Earth
        </a>
        {tiles && (
          <>
            {" "}
            · ©{" "}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
              OpenStreetMap
            </a>
          </>
        )}
      </div>
    </div>
  );
}
