import { Position } from "@rpg-village/utils/node";

import { Effect } from "@/features/effect";
import { RenderableNode } from "@/features/node";

export type MapNodeID = string;
export interface MapNodeBase {
  id: MapNodeID;
  position: Position;
  size: number;
}

export interface DestructibleNode extends MapNodeBase {
  hp: number;
  maxHp: number;
  effects: Effect[];
}

export type MapObjectID = string;
export interface MapObject extends MapNodeBase, RenderableNode {
  id: MapObjectID;
}

export type MapObjectInit = Omit<MapObject, "id">;

export type MapNode = MapNodeBase | DestructibleNode | MapObject;

export function isDestructibleNode(mapNode: MapNode): mapNode is DestructibleNode {
  return "hp" in mapNode;
}
