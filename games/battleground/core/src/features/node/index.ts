import { Position } from "@rpg-village/utils/node";

export type NodeID = string;

export type SpriteID = string;

export interface NodeBase {
  id: NodeID;
  position: Position;
  size: number;
}

export interface RenderableNode {
  spriteId: SpriteID;
}
