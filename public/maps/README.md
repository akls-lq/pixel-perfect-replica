`countries.geojson` contains the Natural Earth 1:50m country boundaries (public domain),
converted from world-atlas 2.0.2 `countries-50m.json` on 2026-10-28.

Source: https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json
Natural Earth: https://www.naturalearthdata.com/about/terms-of-use/
world-atlas: https://github.com/topojson/world-atlas

The local map works without an API key or third-party tile requests. Street tiles
come from OpenStreetMap, are enabled by default at zoom 4+, and can be disabled
with the Streets checkbox. If they fail, the local map remains visible.

City names/positions and rivers are also public-domain Natural Earth data:

- https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_10m_populated_places_simple.geojson
- https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_50m_rivers_lake_centerlines.geojson

Only display attributes are retained, and coordinates are rounded to 4 decimals.
French department boundaries come from
https://github.com/gregoiredavid/france-geojson (IGN/GéoFLA, Licence Ouverte).

Latin Open Sans Semibold glyphs are hosted locally from
https://cdn.jsdelivr.net/gh/maplibre/demotiles@gh-pages/font/Open%20Sans%20Semibold/0-255.pbf
under the SIL Open Font License; see `fonts/OFL.txt`.
