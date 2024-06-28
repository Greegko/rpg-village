import { without } from "rambda";

import { BattlefieldConfig, Projectile, ResourceManager, Unit, UnitInit } from "./interface";
import { Random } from "../utils";
import { Context } from "./context";
import { EffectsContext } from "./effects";
import { ManuallyControlledUnit } from "./manually-controlled-unit";
import { MapContext } from "./map";
import { SpellsContext } from "./spells";
import { UnitContext } from "./unit";

export interface BattlefieldState {
  tick: number;
  units: Unit[];
  projectiles: Projectile[];
}

export interface BattlefieldInit {
  units: UnitInit[];
}

export class Battlefield {
  private context: Context;

  private ticker: number = 0;

  constructor(config: BattlefieldConfig, resourceManager: ResourceManager) {
    this.context = {} as Context;

    Object.assign(this.context, {
      config,
      unit: new UnitContext(this.context),
      map: new MapContext(this.context),
      manuallyControlledUnit: new ManuallyControlledUnit(),
      effect: new EffectsContext(this.context),
      spells: new SpellsContext(this.context),
      resourceManager,
      random: new Random(config.seed),
    } as Context);
  }

  init(init: BattlefieldInit) {
    init.units.forEach(unit => this.context.unit.addUnit(unit));
  }

  tick() {
    this.ticker += 1;

    const aliveUnits = this.context.unit.units.filter(x => x.hp > 0);

    for (let unit of aliveUnits) {
      unit.moveDirection = undefined;

      // this.context.unit.wander(unit);
      this.context.unit.triggerActionState(unit);
      this.context.unit.seekAndMoveToTarget(unit, this.context.unit.units);
      this.context.unit.lockActionWithTarget(unit, this.context.unit.units);
      this.context.unit.executeAction(unit);
      this.context.unit.separation(unit, aliveUnits);
      this.context.unit.screenBoundaries(unit);
      this.context.unit.moveUnit(unit);
      this.context.unit.triggerDotEffects(unit);
    }

    for (let unit of aliveUnits) {
      this.context.unit.flagToClearAuraEffects(unit);
    }

    for (let unit of aliveUnits) {
      this.context.unit.triggerAura(unit, this.context.unit.units);
    }

    for (let unit of aliveUnits) {
      this.context.unit.clearAuraEffects(unit);
    }

    for (let projectile of this.context.map.projectiles) {
      projectile.timeState -= 1;

      if (projectile.timeState < 0) {
        this.context.map.landProjectile(projectile);
        this.context.map.projectiles = without([projectile], this.context.map.projectiles);
      }
    }
  }

  get spellsContext(): SpellsContext {
    return this.context.spells;
  }

  getState(): BattlefieldState {
    return {
      tick: this.ticker,
      units: this.context.unit.units,
      projectiles: this.context.map.projectiles,
    };
  }

  get isFinished(): boolean {
    const actionableUnits = this.context.unit.units.filter(x => x.hp > 0);

    return actionableUnits.every((x, _index, array) => x.team === array[0].team);
  }
}
