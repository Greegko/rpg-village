import { map } from "ramda";

import { MapID } from "@rpg-village/core";

import {
  mapLocationsByMapIdSelector,
  partiesGroupedOnLocationsSelector,
  useGameStateSelector,
} from "../../../game/store/game";
import { Tile } from "./tile";

interface MapProperties {
  mapId: MapID;
}

export const Map = ({ mapId }: MapProperties) => {
  const partiesOnLocations = useGameStateSelector(partiesGroupedOnLocationsSelector);
  const locations = useGameStateSelector(state => mapLocationsByMapIdSelector(state, mapId));

  return (
    <>
      {map(
        location => (
          <Tile
            key={location.id}
            parties={partiesOnLocations[location.id]}
            locationType={location.type}
            x={61 * location.x}
            y={35 * location.y}
          />
        ),
        locations,
      )}
    </>
  );
};
