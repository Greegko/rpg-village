import { MapID, MapLocation } from "@rpg-village/core";

import { mapLocationsByMapIdSelector, partiesOnLocationSelector, useGameStateSelector } from "@web/store/game";

import { Tile } from "./tile";

interface MapProperties {
  mapId: MapID;
}

export const Map = ({ mapId }: MapProperties) => {
  const locations = useGameStateSelector(state => mapLocationsByMapIdSelector(state, mapId));

  if (locations === undefined) return null;

  return (
    <div className="relative" style={{ top: window.innerHeight / 2, left: window.innerWidth / 2 }}>
      {locations.map(location => (
        <MapLocationDisplay location={location} />
      ))}
    </div>
  );
};

const MapLocationDisplay = ({ location }: { location: MapLocation }) => {
  const partiesOnLocations = useGameStateSelector(state => partiesOnLocationSelector(state, location.id));

  return (
    <Tile
      key={location.id}
      parties={partiesOnLocations}
      locationType={location.type}
      x={61 * location.x}
      y={35 * location.y}
    />
  );
};
