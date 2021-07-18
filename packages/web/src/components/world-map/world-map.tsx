import * as React from 'react';
import { MapStage } from './map/map-stage';

import './world-map.scss';
export const WorldMap = () => {
  const [mapSize, setMapSize] = React.useState<[number, number] | null>(null);

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
    <div className='worldmap' ref={mapRef}>
      {mapSize && <MapStage width={mapSize[0]} height={mapSize[1]} />}
    </div>
  );
}
