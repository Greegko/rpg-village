import * as React from 'react';
import { connect } from 'react-redux';
import { MapLocation, MapLocationID, Party } from '@rpg-village/core';
import { GameStoreState, worldLocationsSelector, partiesGroupedOnLocationsSelector } from '../../../game';
import { Tile } from './tile';

const propertyMapper = (state: GameStoreState) => {
  return {
    partiesOnLocations: partiesGroupedOnLocationsSelector(state.game),
    locations: worldLocationsSelector(state.game)
  }
}

interface MapProperties {
  locations: MapLocation[];
  partiesOnLocations: Record<MapLocationID, Party[]>;
  onTileClick: (locationId: string) => void;
}

export const Map = connect(propertyMapper)
  (
    ({ locations, partiesOnLocations, onTileClick }: MapProperties) => (
      locations.map(
        location =>
          <Tile
            key={location.id}
            onClick={() => onTileClick(location.id)}
            parties={partiesOnLocations[location.id]}
            x={61 * location.x}
            y={35 * location.y} />
      ) as any
    )
  );
