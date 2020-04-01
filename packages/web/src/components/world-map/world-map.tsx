import * as React from 'react';
import { connect } from 'react-redux';
import { HeroList } from './hero-list';
import { DeveloperToolbar } from '../dev/developer-toolbar';
import { Unit } from '@rpg-village/core';
import { GameStoreState, heroUnitsSelector } from '../../game';
import { MapStage } from './map/map-stage';

import './world-map.scss';

const propertyMapper = (state: GameStoreState): WorldMapProperties => ({
  heroes: heroUnitsSelector(state)
});

interface WorldMapProperties {
  heroes: Unit[];
}

export const WorldMap = connect(propertyMapper)
  (
    ({ heroes }: WorldMapProperties) => {
      const mapRef = React.useRef<HTMLDivElement>(null);
      const [mapSize, setMapSize] = React.useState(null);

      React.useEffect(() => {
        const handleResize = () => setMapSize([
          mapRef.current.offsetWidth,
          mapRef.current.offsetHeight
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

          <HeroList heroes={heroes} />
          <DeveloperToolbar />
        </div>
      );
    }
  );
