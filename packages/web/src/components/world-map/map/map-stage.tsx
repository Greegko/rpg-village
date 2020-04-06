import * as React from 'react';
import { Layer, Stage } from 'react-konva';
import { Provider, ReactReduxContext } from 'react-redux';
import { Map } from './map';

interface MapStageProperties {
  width: number;
  height: number;
  onTileClick: (locationId: string) => void;
  onOutsideClick: () => void;
}

export const MapStage = ({ width, height, onTileClick, onOutsideClick }: MapStageProperties) => (
  <ReactReduxContext.Consumer>
    {({ store }) => (
      <Stage width={width} height={height} draggable={true} offsetX={-width / 2} offsetY={-height / 2} onClick={onOutsideClick}>
        <Provider store={store}>
          <Layer>
            <Map onTileClick={onTileClick} />
          </Layer>
        </Provider>
      </Stage>
    )}
  </ReactReduxContext.Consumer>
);
