import * as React from 'react';
import { connect } from 'react-redux';
import { Unit, MapLocationID } from '@rpg-village/core';
import { HeroList } from './hero-list';
import { DeveloperToolbar } from '../dev/developer-toolbar';
import { GameStoreState, heroUnitsSelector } from '../../game';
import { MapStage } from './map/map-stage';
import { ActionMenu } from './action-menu/action-menu';
import { Icons } from '../shared';

const propertyMapper = (state: GameStoreState): WorldMapProperties => ({
  heroes: heroUnitsSelector(state)
});

interface WorldMapProperties {
  heroes: Unit[];
}

import './world-map.scss';
export const WorldMap = connect(propertyMapper)
  (
    ({ heroes }: WorldMapProperties) => {
      const [actionMenuVisible, setActionMenuVisible] = React.useState(false);
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
        setActionMenuVisible(true);
      }

      const onOutsideClick = () => {
        setActionMenuVisible(false);
      }

      return (
        <div>
          <div className='worldmap' ref={mapRef}>
            {actionMenuVisible && <ActionMenu
              actions={[
                { title: "Attack", onClick: () => console.log('Attack'), icon: Icons.Attack, tooltip: 'Attack!' },
                { title: "Travel", onClick: () => console.log('Travel'), icon: Icons.Travel, tooltip: 'Attack!' },
                { title: "Explore", onClick: () => console.log('Explore'), icon: Icons.Explore, tooltip: 'Attack!' },
              ]}
            />}
            {mapSize && <MapStage width={mapSize[0]} height={mapSize[1]} onTileClick={onTileClick} onOutsideClick={onOutsideClick} />}
          </div>

          <HeroList heroes={heroes} />
          <DeveloperToolbar />
        </div>
      );
    }
  );
