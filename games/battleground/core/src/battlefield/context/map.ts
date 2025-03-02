import { without } from "rambda";

import { Position, multVector, normVector, subVector } from "@rpg-village/utils/node";
import { Rectangle, SpatialHash } from "@rpg-village/utils/spatial-hash";

import { inject, injectable } from "../injection-container";
import { ProjectileNode, ProjectileType } from "../interface";
import { filterBySeekConditions } from "../utils/unit-filter";
import { EffectsContext } from "./effects";
import { UnitContext } from "./unit";

type MapNode = { id: string; position: Position; size: number };

const nodeToRectangle = (node: MapNode) => ({
  left: node.position.x,
  right: node.position.x + node.size,
  top: node.position.y,
  bottom: node.position.y + node.size,
});

const projectileToRectangle = (node: ProjectileNode): Rectangle => ({
  left: node.position.x,
  right: node.position.x + 8,
  top: node.position.y,
  bottom: node.position.y + 8,
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

      const d = multVector(normVector(subVector(projectile.targetPosition, projectile.sourcePosition)), projectile.speed);
      projectile.position.x += d.x;
      projectile.position.y += d.y;

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
      { team: projectile.source.team, targetPosition: projectile.position },
    );

    hitUnits.forEach(unit => this.effectsContext.applyEffect(projectile.effect, unit));
  }
}
