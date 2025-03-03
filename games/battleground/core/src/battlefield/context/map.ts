import { without } from "rambda";

import { Position, multVector, normVector, subVector } from "@rpg-village/utils/node";
import { Rectangle, SpatialHash } from "@rpg-village/utils/spatial-hash";

import { MapNode, MapObject, isDestructibleNode } from "@/features/map";
import { Projectile, ProjectileType } from "@/features/projectile";
import { RandomContextToken } from "@/features/random";
import { filterBySeekConditions } from "@/features/unit";

import { inject, injectable } from "../injection-container";
import { EffectsContext } from "./effects";
import { UnitContext } from "./unit";

type HashNode = { position: Position; size: number };

const nodeToRectangle = (node: HashNode): Rectangle => ({
  left: node.position.x,
  right: node.position.x + node.size,
  top: node.position.y,
  bottom: node.position.y + node.size,
});

@injectable()
export class MapContext {
  private unitContext = inject(UnitContext);
  private effectsContext = inject(EffectsContext);
  private randomContext = inject(RandomContextToken);

  projectiles: Projectile[] = [];
  mapObjects: MapObject[] = [];

  tickProjectiles(): void {
    const hash = new SpatialHash<MapNode>(48, nodeToRectangle);
    this.unitContext.units.filter(x => x.hp > 0).forEach(unit => hash.add(unit));
    this.mapObjects.forEach(mapObject => hash.add(mapObject));

    for (let projectile of this.projectiles) {
      projectile.timeState -= 1;

      const d = multVector(normVector(subVector(projectile.targetPosition, projectile.sourcePosition)), projectile.speed);
      projectile.position.x += d.x;
      projectile.position.y += d.y;

      if (projectile.projectileType === ProjectileType.Linear) {
        const set = hash.search(nodeToRectangle(projectile));
        set.delete(projectile.source);

        if (set.size > 0) {
          set.values().forEach(node => this.projectileHit(projectile, node));

          this.projectiles = without([projectile], this.projectiles);
          continue;
        }
      }

      if (projectile.timeState < 0) {
        this.landProjectile(projectile);
        this.projectiles = without([projectile], this.projectiles);
      }
    }
  }

  addProjectile(projectile: Projectile): void {
    this.projectiles.push(projectile);
  }

  addMapObject(mapObject: Omit<MapObject, "id">): void {
    this.mapObjects.push({
      ...mapObject,
      id: this.randomContext.uniqueId(),
    });
  }

  private projectileHit(projectile: Projectile, mapNode: MapNode): void {
    if (isDestructibleNode(mapNode)) {
      this.effectsContext.applyDmgEffect(projectile.effect, mapNode);
    }
  }

  private landProjectile(projectile: Projectile): void {
    const hitUnits = filterBySeekConditions(
      this.unitContext.units,
      ["enemy-team", "alive", ["in-distance", { distance: projectile.size }]],
      { team: projectile.source.team, targetPosition: projectile.position },
    );

    hitUnits.forEach(unit => this.effectsContext.applyEffect(projectile.effect, unit));
  }
}
