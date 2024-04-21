import { Position } from "./position";

export type EntityID = string;

export interface MapElement {
  id: EntityID;
  position: Position;
}

export interface MapElements {
  [key: EntityID]: MapElement;
}
