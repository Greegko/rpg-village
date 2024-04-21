import { PositionString } from "./position";

export type MapElementID = PositionString;

export interface MapElement {
  id: MapElementID;
  entityId: string;
}

export interface MapElements {
  [key: MapElementID]: MapElement;
}
