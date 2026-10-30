# GasTrack

Application web (React + TypeScript + Vite) qui affiche sur une carte les prix des carburants en France, à partir de l'API publique du gouvernement ([data.economie.gouv.fr](https://data.economie.gouv.fr/explore/dataset/prix-des-carburants-en-france-flux-instantane-v2/)).

## Fonctionnalités
- Carte interactive (Leaflet / OpenStreetMap) avec une pastille de prix par station, du vert (moins cher) au rouge (plus cher)
- Choix du carburant : Gazole, SP95-E10, SP95, SP98, E85, GPLc
- Les 100 stations les moins chères de la zone visible (rayon automatique, 30 km max)
- Stations chargées et affichées uniquement à partir d'un certain zoom (aucune requête sur une vue trop large, par exemple toute la France) : réglable via `MIN_ZOOM_FOR_STATIONS` dans `src/config.ts`
- Liste synchronisée avec la carte, détail de tous les prix et lien d'itinéraire
- Géolocalisation (« Autour de moi »)

## Structure
```
src/
├── api/          fuelApi.ts          Appel à l'API et transformation des données
├── components/   Header, FuelSelector, MapView, StationList, StationCard, StationPopup, PriceLegend
├── hooks/        useStations.ts, useGeolocation.ts
├── types/        station.ts          Types métier (Station, FuelType…)
├── utils/        format.ts           Formatage prix / distance / couleurs
├── App.tsx       Composition et état global
└── styles.css
```

## Développement
```bash
npm install
npm run dev        # http://localhost:5173
```

## Production
```bash
npm run build      # génère dist/
npm run preview
```
Ou avec Docker : `docker compose up -d --build` puis http://localhost:8080
