import { connect } from "react-redux";
import { MapLocation, MapLocationID, Party } from "@rpg-village/core";
import { GameStoreState, mapLocationsSelector, partiesGroupedOnLocationsSelector } from "../../../game";
import { Tile } from "./tile";

const propertyMapper = (state: GameStoreState) => {
  return {
    partiesOnLocations: partiesGroupedOnLocationsSelector(state.game),
    locations: mapLocationsSelector(state.game),
  };
};

interface MapProperties {
  locations: MapLocation[];
  partiesOnLocations: Record<MapLocationID, Party[]>;
}

export const Map = connect(propertyMapper)(
  ({ locations, partiesOnLocations }: MapProperties) =>
    locations.map(location => (
      <Tile
        key={location.id}
        parties={partiesOnLocations[location.id]}
        locationType={location.type}
        x={61 * location.x}
        y={35 * location.y}
      />
    )) as any,
);
