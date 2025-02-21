import { Effect, Position, ProjectileID, ProjectileType, Unit } from "./unit";

export interface Projectile {
  projectileId: ProjectileID;
  projectileType: ProjectileType;
  source: Unit;
  sourceLocation: Position;
  targetLocation: Position;
  speed: number;
  time: number;
  timeState: number;
  area: number;
  effect: Effect[];
}
