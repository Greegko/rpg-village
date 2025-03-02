import { Position } from "@rpg-village/utils/node";

import { Effect } from "@/features/effect";
import { SpriteID } from "@/features/node";
import { Unit } from "@/features/unit";

export type ProjectileID = string;

export enum ProjectileType {
  Linear = 1,
  Arc,
}

export interface Projectile {
  id: ProjectileID;
  spriteId: SpriteID;
  projectileType: ProjectileType;
  source: Unit;
  size: number;
  sourcePosition: Position;
  targetPosition: Position;
  speed: number;
  time: number;
  effect: Effect[];
  position: Position;
  timeState: number;
}
