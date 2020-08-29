import * as React from 'react';
import { connect } from 'react-redux';
import { MapLocationID, Party } from '@rpg-village/core';
import { keys } from 'ramda';
import { Sidebar } from './sidebar';
import { DeveloperToolbar } from '../dev/developer-toolbar';
import { GameStoreState, playerPartiesSelector } from '../../game';
import { MapStage } from './map/map-stage';
import { ActionMenu } from './action-menu/action-menu';

const propertyMapper = (state: GameStoreState): WorldMapProperties => ({
  parties: playerPartiesSelector(state.game)
});

interface WorldMapProperties {
  parties: Record<string, Party>;
}

import './world-map.scss';
export const WorldMap = connect(propertyMapper)
  (
    ({ parties }: WorldMapProperties) => {
      const [actionMenuLocationId, setActionMenuLocationId] = React.useState(null);
      const [mapSize, setMapSize] = React.useState(null);

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

      const onTileClick = (locationId: MapLocationID) => {
        setActionMenuLocationId(locationId);
      }

      const onOutsideClick = () => {
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
