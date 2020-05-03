import * as React from 'react';
import { connect } from 'react-redux';
import { Unit, MapLocationID } from '@rpg-village/core';
import { Sidebar } from './sidebar';
import { DeveloperToolbar } from '../dev/developer-toolbar';
import { GameStoreState, heroUnitsSelector } from '../../game';
import { MapStage } from './map/map-stage';
import { ActionMenu } from './action-menu/action-menu';

const propertyMapper = (state: GameStoreState): WorldMapProperties => ({
  heroes: heroUnitsSelector(state.game)
});

interface WorldMapProperties {
  heroes: Unit[];
}

import './world-map.scss';
export const WorldMap = connect(propertyMapper)
  (
    ({ heroes }: WorldMapProperties) => {
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

          <Sidebar heroes={heroes.map(x => x.id)} />
          <DeveloperToolbar />
        </div>
      );
    }
  );
