import { without } from "rambda";

import { Rectangle, SpatialHash } from "@rpg-village/utils";

import { multVector, normVector, subVector } from "../utils";
import { EffectsContext } from "./effects";
import { inject, injectable } from "./injection-container";
import { Position, ProjectileNode, ProjectileType } from "./interface";
import { UnitContext } from "./unit";
import { filterBySeekConditions } from "./utils/unit-filter";

type MapNode = { id: string; location: Position; size: number };

const nodeToRectangle = (node: MapNode) => ({
  left: node.location.x,
  right: node.location.x + node.size,
  top: node.location.y,
  bottom: node.location.y + node.size,
});

const projectileToRectangle = (node: ProjectileNode): Rectangle => ({
  left: node.location.x,
  right: node.location.x + 8,
  top: node.location.y,
  bottom: node.location.y + 8,
});

@injectable()
export class MapContext {
  private unitContext = inject(UnitContext);
  private effectsContext = inject(EffectsContext);
  projectiles: ProjectileNode[] = [];

  tickProjectiles(): void {
    const hash = new SpatialHash<MapNode>(48, nodeToRectangle);
    this.unitContext.units.forEach(unit => hash.add(unit));

    for (let projectile of this.projectiles) {
      projectile.timeState -= 1;

      const d = multVector(normVector(subVector(projectile.targetLocation, projectile.sourceLocation)), projectile.speed);
      projectile.location.x += d.x;
      projectile.location.y += d.y;

      if (projectile.projectileType === ProjectileType.Linear) {
        const set = hash.search(projectileToRectangle(projectile));
        set.delete(projectile.source);

        if (set.size > 0) {
          this.landProjectile(projectile);
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

  addProjectile(projectile: ProjectileNode): void {
    this.projectiles.push(projectile);
  }

  private landProjectile(projectile: ProjectileNode): void {
    const hitUnits = filterBySeekConditions(
      this.unitContext.units,
      ["enemy-team", "alive", ["in-distance", { distance: projectile.area }]],
      { team: projectile.source.team, targetLocation: projectile.location },
    );

    hitUnits.forEach(unit => this.effectsContext.applyEffect(projectile.effect, unit));
  }
}
