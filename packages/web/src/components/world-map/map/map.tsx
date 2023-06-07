import { MapID, MapLocation } from "@rpg-village/core";

import { mapLocationsByMapIdSelector, partiesOnLocationSelector, useGameStateSelector } from "@web/store/game";

import { Tile } from "./tile";

interface MapProperties {
  mapId: MapID;
}

export const Map = ({ mapId }: MapProperties) => {
  const locations = useGameStateSelector(state => mapLocationsByMapIdSelector(state, mapId));

  if (locations === undefined) return null;

  return <>{locations.map(MapLocationDisplay)}</>;
};

const MapLocationDisplay = (location: MapLocation) => {
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
