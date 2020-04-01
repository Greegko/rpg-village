import * as React from 'react';
import { Tile } from './tile';
import { MapLocation, MapLocationID, Party } from '@rpg-village/core';
import { GameStoreState, worldLocationsSelector, partiesGroupedOnLocationsSelector } from '../../../game';
import { connect } from 'react-redux';

const propertyMapper = (state: GameStoreState) => {
  return {
    partiesOnLocations: partiesGroupedOnLocationsSelector(state),
    locations: worldLocationsSelector(state)
  }
}

interface MapProperties {
  locations: MapLocation[];
  partiesOnLocations: Record<MapLocationID, Party[]>
}

export const Map = connect(propertyMapper)
  (
    ({ locations, partiesOnLocations }: MapProperties) => (
      locations.map(
        location =>
          <Tile key={location.id}
            parties={partiesOnLocations[location.id]}
            x={61 * location.x}
            y={35 * location.y} />
      ) as any
    )
  );
