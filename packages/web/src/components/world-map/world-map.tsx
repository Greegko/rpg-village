import * as React from 'react';
import { connect } from 'react-redux';
import { MapLocation, Party } from '@rpg-village/core';
import { keys } from 'ramda';
import { Sidebar } from './sidebar';
import { DeveloperToolbar } from '../dev/developer-toolbar';
import { GameStoreState, playerPartiesSelector } from '../../game';
import { MapStage } from './map/map-stage';

const propertyMapper = (state: GameStoreState): WorldMapProperties => ({
  locations: state.game.world,
  parties: playerPartiesSelector(state.game)
});


interface WorldMapProperties {
  parties: Record<string, Party>;
  locations: Record<string, MapLocation>;
}

import './world-map.scss';
export const WorldMap = connect(propertyMapper)
  (
    ({ parties }: WorldMapProperties) => {
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

      return (
        <div>
          <div className='worldmap' ref={mapRef}>
            {mapSize && <MapStage width={mapSize[0]} height={mapSize[1]} />}
          </div>

          <Sidebar parties={keys(parties)} />
          <DeveloperToolbar />
        </div>
      );
    }
  );
