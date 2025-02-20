import { Context } from "./context";
import { Projectile } from "./interface";
import { filterBySeekConditions } from "./utils/unit-filter";

export class MapContext {
  constructor(private context: Context) {}

  projectiles: Projectile[] = [];

  addProjectile(projectile: Projectile) {
    this.projectiles.push(projectile);
  }

  landProjectile(projectile: Projectile) {
    const hitUnits = filterBySeekConditions(
      this.context.unit.units,
      ["enemy-team", "alive", ["in-distance", { distance: projectile.area }]],
      { team: projectile.source.team, targetLocation: projectile.targetLocation },
    );

    hitUnits.forEach(unit => this.context.effect.applyEffect(projectile.effect, unit));
  }
}
