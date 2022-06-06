import { map } from "ramda";
import { connect } from "react-redux";

import { MapID, MapLocation, MapLocationID, Party } from "@rpg-village/core";

import { GameStoreState } from "../../../game";
import { mapLocationsByMapIdSelector, partiesGroupedOnLocationsSelector } from "../../../game/selectors/game";
import { Tile } from "./tile";

const propertyMapper = (state: GameStoreState, props: MapOwnProperties) => {
  return {
    partiesOnLocations: partiesGroupedOnLocationsSelector(state.game),
    locations: mapLocationsByMapIdSelector(state.game, props.mapId),
  };
};

interface MapOwnProperties {
  mapId: MapID;
}

interface MapStateProperties {
  locations: MapLocation[];
  partiesOnLocations: Record<MapLocationID, Party[]>;
}

type MapProperties = MapOwnProperties & MapStateProperties;

export const Map = connect(propertyMapper)(({ locations, partiesOnLocations }: MapProperties) => (
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
));
