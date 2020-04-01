import * as React from 'react';
import { Layer, Stage } from 'react-konva';
import { Provider, ReactReduxContext } from 'react-redux';
import { Map } from './map';

interface MapStageProperties {
  width: number;
  height: number;
}

export const MapStage = ({ width, height }: MapStageProperties) => (
  <ReactReduxContext.Consumer>
    {({ store }) => (
      <Stage width={width} height={height} draggable={true} offsetX={-width / 2} offsetY={-height / 2}>
        <Provider store={store}>
          <Layer>
            <Map />
          </Layer>
        </Provider>
      </Stage>
    )}
  </ReactReduxContext.Consumer>
);
