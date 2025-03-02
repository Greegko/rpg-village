import { Position } from "@rpg-village/utils/node";

import { Effect, ProjectileID, ProjectileType, SpriteID, Unit } from "./unit";

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
  area: number;
  effect: Effect[];
}

export interface ProjectileNode extends Projectile {
  position: Position;
  timeState: number;
}
