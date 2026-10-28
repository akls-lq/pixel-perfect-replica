export type MapCity = {
  name: string;
  coordinates: [number, number];
  commune?: string;
};
export const mapCities: MapCity[] = [
  { name: "Paris", coordinates: [2.3522, 48.8566], commune: "75056" },
  { name: "Lyon", coordinates: [4.8357, 45.764], commune: "69123" },
  { name: "Marseille", coordinates: [5.3698, 43.2965], commune: "13055" },
  { name: "Toulouse", coordinates: [1.4442, 43.6047], commune: "31555" },
  { name: "Bordeaux", coordinates: [-0.5792, 44.8378], commune: "33063" },
  { name: "Nantes", coordinates: [-1.5536, 47.2184], commune: "44109" },
  { name: "Lille", coordinates: [3.0573, 50.6292], commune: "59350" },
  { name: "Strasbourg", coordinates: [7.7521, 48.5734], commune: "67482" },
  { name: "Rennes", coordinates: [-1.6778, 48.1173], commune: "35238" },
  { name: "Montpellier", coordinates: [3.8767, 43.6119], commune: "34172" },
  { name: "Nice", coordinates: [7.262, 43.7102], commune: "06088" },
  { name: "Grenoble", coordinates: [5.7245, 45.1885], commune: "38185" },
  { name: "Rouen", coordinates: [1.0993, 49.4432], commune: "76540" },
  { name: "Reims", coordinates: [4.0317, 49.2583], commune: "51454" },
  { name: "Dijon", coordinates: [5.0415, 47.322], commune: "21231" },
  { name: "Tours", coordinates: [0.6848, 47.3941], commune: "37261" },
  { name: "Angers", coordinates: [-0.5632, 47.4784], commune: "49007" },
  { name: "Brest", coordinates: [-4.4861, 48.3904], commune: "29019" },
  { name: "Clermont-Ferrand", coordinates: [3.087, 45.7772], commune: "63113" },
  { name: "Metz", coordinates: [6.1757, 49.1193], commune: "57463" },
  { name: "Nancy", coordinates: [6.1844, 48.6921], commune: "54395" },
  { name: "Berlin", coordinates: [13.405, 52.52] },
  { name: "Hamburg", coordinates: [9.9937, 53.5511] },
  { name: "Munich", coordinates: [11.582, 48.1351] },
  { name: "Frankfurt", coordinates: [8.6821, 50.1109] },
  { name: "Cologne", coordinates: [6.9603, 50.9375] },
  { name: "Stuttgart", coordinates: [9.1829, 48.7758] },
  { name: "Düsseldorf", coordinates: [6.7735, 51.2277] },
  { name: "Leipzig", coordinates: [12.3731, 51.3397] },
  { name: "Dresden", coordinates: [13.7373, 51.0504] },
  { name: "Hannover", coordinates: [9.732, 52.3759] },
  { name: "London", coordinates: [-0.1276, 51.5072] },
  { name: "Brussels", coordinates: [4.3517, 50.8503] },
  { name: "Amsterdam", coordinates: [4.9041, 52.3676] },
  { name: "Madrid", coordinates: [-3.7038, 40.4168] },
  { name: "Barcelona", coordinates: [2.1734, 41.3851] },
  { name: "Lisbon", coordinates: [-9.1393, 38.7223] },
  { name: "Milan", coordinates: [9.19, 45.4642] },
  { name: "Rome", coordinates: [12.4964, 41.9028] },
  { name: "Zurich", coordinates: [8.5417, 47.3769] },
  { name: "Geneva", coordinates: [6.1432, 46.2044] },
  { name: "Vienna", coordinates: [16.3738, 48.2082] },
  { name: "Prague", coordinates: [14.4378, 50.0755] },
  { name: "Warsaw", coordinates: [21.0122, 52.2297] },
  { name: "Stockholm", coordinates: [18.0686, 59.3293] },
  { name: "Copenhagen", coordinates: [12.5683, 55.6761] },
  { name: "Dublin", coordinates: [-6.2603, 53.3498] },
  { name: "New York", coordinates: [-74.006, 40.7128] },
  { name: "San Francisco", coordinates: [-122.4194, 37.7749] },
  { name: "Montréal", coordinates: [-73.5673, 45.5019] },
  { name: "Toronto", coordinates: [-79.3832, 43.6532] },
  { name: "Tokyo", coordinates: [139.6917, 35.6895] },
  { name: "Singapore", coordinates: [103.8198, 1.3521] },
  { name: "Sydney", coordinates: [151.2093, -33.8688] },
];
export function normalizePlace(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}
const aliases: Record<string, string[]> = {
  Munich: ["München"],
  Cologne: ["Köln"],
  Frankfurt: ["Frankfurt am Main"],
  London: ["Londres"],
  Brussels: ["Bruxelles"],
  Lisbon: ["Lisbonne", "Lisboa"],
  Milan: ["Milano"],
  Rome: ["Roma"],
  Geneva: ["Genève"],
  Vienna: ["Vienne", "Wien"],
  Prague: ["Praha"],
  Warsaw: ["Varsovie", "Warszawa"],
  Copenhagen: ["Copenhague", "København"],
};
export function findMapCity(location: string) {
  const parts = normalizePlace(location)
    .split(/[,/;|()]+/)
    .map((p) => p.trim());
  return mapCities.find((city) =>
    [city.name, ...(aliases[city.name] ?? [])].some((name) => parts.includes(normalizePlace(name))),
  );
}
export type JobSourceId = "france-travail" | "arbeitnow" | "greenhouse" | "lever";
export type MapOffer = {
  id: string;
  source: JobSourceId;
  title: string;
  company: string;
  location: string;
  coordinates: [number, number] | null;
  approximate: boolean;
  url: string;
  contract: string;
  salary: string;
};
export type JobSourceStatus = {
  id: JobSourceId;
  name: string;
  status: "connected" | "not-configured" | "unavailable";
  loaded: number;
};
export type MapFeed = { offers: MapOffer[]; sources: JobSourceStatus[]; fetchedAt: string };
export type MapBounds = { west: number; east: number; south: number; north: number };
export function inMapBounds(coordinates: [number, number] | null, bounds: MapBounds) {
  if (!coordinates) return false;
  const [rawLng, lat] = coordinates;
  const lng = ((((rawLng + 180) % 360) + 360) % 360) - 180;
  if (lat < bounds.south || lat > bounds.north) return false;
  if (bounds.east - bounds.west >= 360) return true;
  const west = ((((bounds.west + 180) % 360) + 360) % 360) - 180;
  const east = ((((bounds.east + 180) % 360) + 360) % 360) - 180;
  return west <= east ? lng >= west && lng <= east : lng >= west || lng <= east;
}
