import { without } from "rambda";

import { multVector, normVector, subVector } from "../utils";
import { Context } from "./context";
import { ProjectileNode } from "./interface";
import { filterBySeekConditions } from "./utils/unit-filter";

export class MapContext {
  constructor(private context: Context) {}

  projectiles: ProjectileNode[] = [];

  tickUnitsMove(): void {
    const aliveUnits = this.context.unit.units.filter(x => x.hp > 0);

    for (let unit of aliveUnits.filter(x => x.moveDirection)) {
      this.context.unit.separation(unit, aliveUnits);
      this.context.unit.screenBoundaries(unit);
      this.context.unit.moveUnit(unit);
    }
  }

  tickProjectiles(): void {
    for (let projectile of this.projectiles) {
      projectile.timeState -= 1;

      const d = multVector(normVector(subVector(projectile.targetLocation, projectile.sourceLocation)), projectile.speed);
      projectile.location.x += d.x;
      projectile.location.y += d.y;

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
      this.context.unit.units,
      ["enemy-team", "alive", ["in-distance", { distance: projectile.area }]],
      { team: projectile.source.team, targetLocation: projectile.targetLocation },
    );

    hitUnits.forEach(unit => this.context.effect.applyEffect(projectile.effect, unit));
  }
}
