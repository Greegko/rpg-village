import * as React from 'react';
import { connect } from 'react-redux';
import { MapLocation, MapLocationID, MapLocationType, Party, PartyOwner } from '@rpg-village/core';
import { Dictionary, filter, find, keys, pipe, values } from 'ramda';
import { Sidebar } from './sidebar';
import { DeveloperToolbar } from '../dev/developer-toolbar';
import { GameOverlay, GameStoreState, openOverlay, playerPartiesSelector } from '../../game';
import { MapStage } from './map/map-stage';
import { ActionMenu } from './action-menu/action-menu';

const storeDispatchers = { openOverlay };

const propertyMapper = (state: GameStoreState): WorldMapProperties => ({
  locations: state.game.world,
  parties: playerPartiesSelector(state.game)
});

interface WorldMapActions {
  openOverlay: typeof openOverlay;
}

interface WorldMapProperties {
  parties: Record<string, Party>;
  locations: Record<string, MapLocation>;
}

import './world-map.scss';
export const WorldMap = connect(propertyMapper, storeDispatchers)
  (
    ({ parties, locations, openOverlay }: WorldMapProperties & WorldMapActions) => {
      const [activeUnit, setActiveUnit] = React.useState<null | string>(null);
      const [actionMenuLocationId, setActionMenuLocationId] = React.useState<string>(null);
      const [mapSize, setMapSize] = React.useState<[number, number]>(null);

      const mapRef = React.useCallback<(element: HTMLDivElement) => void>(node => {
        if (!node) return;

        const handleResize = () => setMapSize([
          node.offsetWidth,
          node.offsetHeight
        ]);

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
      }, []);

      const onTileClick = React.useCallback((locationId: MapLocationID) => {
        const targetLocation = locations[locationId];

        if (targetLocation.type === MapLocationType.Village && !activeUnit) {
          return openOverlay(GameOverlay.Village);
        }

        if (activeUnit) {
          return setActionMenuLocationId(locationId);
        }

        const userParty = pipe(
          (parties: Dictionary<Party>) => values(parties),
          filter<Party>((x: Party) => x.locationId === locationId),
          find(x => x.owner === PartyOwner.Player)
        )(parties);

        if (userParty) {
          setActiveUnit(userParty.id);
        }
      }, [])

      const onOutsideClick = () => {
        setActiveUnit(null);
        setActionMenuLocationId(null);
      }

      return (
        <div>
          <div className='worldmap' ref={mapRef}>
            {actionMenuLocationId && <ActionMenu locationId={actionMenuLocationId} />}
            {mapSize && <MapStage width={mapSize[0]} height={mapSize[1]} onTileClick={onTileClick} onOutsideClick={onOutsideClick} />}
          </div>

          <Sidebar parties={keys(parties)} />
          <DeveloperToolbar />
        </div>
      );
    }
  );
