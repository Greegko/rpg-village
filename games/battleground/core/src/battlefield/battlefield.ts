import { without } from "rambda";

import { Random, Vector, normVector } from "../utils";
import { Context } from "./context";
import { AiController } from "./controllers/ai";
import { EffectsContext } from "./effects";
import { BattlefieldConfig, Position, Projectile, ResourceManager, Unit, UnitID, UnitInit } from "./interface";
import { MapContext } from "./map";
import { SpellsContext } from "./spells";
import { UnitContext } from "./unit";

export interface BattlefieldState {
  units: Unit[];
  projectiles: Projectile[];
}

export interface BattlefieldInit {
  units: UnitInit[];
}

export class Battlefield {
  private context: Context;

  constructor(config: BattlefieldConfig, resourceManager: ResourceManager) {
    this.context = {} as Context;

    Object.assign(this.context, {
      config,
      unit: new UnitContext(this.context),
      map: new MapContext(this.context),
      effect: new EffectsContext(this.context),
      spells: new SpellsContext(this.context),
      resourceManager,
      random: new Random(config.seed),
    } as Context);
  }

  init(init: BattlefieldInit) {
    init.units.forEach(unit => this.context.unit.addUnit(unit));
  }

  setUserControlledUnit(unitId: UnitID) {
    const unit = this.context.unit.getUnitById(unitId);
    unit.userControlled = true;
  }

  setUnitDirection(unitId: UnitID, direction: Vector) {
    const unit = this.context.unit.getUnitById(unitId);
    unit.moveDirection = normVector(direction);
  }

  setUnitShootAction(unitId: UnitID, targetPosition: Position) {
    const unit = this.context.unit.getUnitById(unitId);

    const action = unit.actions[0];

    unit.activeAction = { action, speed: action.speed, targetPosition };
  }

  tick() {
    const aliveUnits = this.context.unit.units.filter(x => x.hp > 0);

    const aiController = new AiController(this.context.random);

    for (let unit of aliveUnits.filter(x => !x.userControlled)) {
      aiController.execute(this.context.unit.units, unit);
    }

    for (let unit of aliveUnits.filter(x => x.moveDirection)) {
      this.context.unit.separation(unit, aliveUnits);
      this.context.unit.screenBoundaries(unit);
      this.context.unit.moveUnit(unit);
    }

    for (let unit of aliveUnits) {
      this.context.unit.triggerActionState(unit);
      this.context.unit.executeAction(unit);
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
      units: this.context.unit.units,
      projectiles: this.context.map.projectiles,
    };
  }

  get isFinished(): boolean {
    const actionableUnits = this.context.unit.units.filter(x => x.hp > 0);

    return actionableUnits.every((x, _index, array) => x.team === array[0].team);
  }
}
