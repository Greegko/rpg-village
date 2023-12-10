import { Layer, Stage } from "react-konva";
import { Provider, ReactReduxContext } from "react-redux";

import { MapID } from "@rpg-village/core";

import { Map } from "./map";

interface MapStageProperties {
  worldMapId: MapID;
  width: number;
  height: number;
}

export const MapStage = ({ width, height, worldMapId }: MapStageProperties) => (
  <ReactReduxContext.Consumer>
    {val => (
      <Stage width={width} height={height} draggable={true} offsetX={-width / 2} offsetY={-height / 2}>
        <Provider store={val!.store}>
          <Layer>
            <Map mapId={worldMapId} />
          </Layer>
        </Provider>
      </Stage>
    )}
  </ReactReduxContext.Consumer>
);
