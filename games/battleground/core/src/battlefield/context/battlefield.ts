import { Position, isNullVector } from "@rpg-village/utils/node";
import { Vector, normVector } from "@rpg-village/utils/node";

import { inject, injectable } from "../injection-container";
import { Projectile, Unit, UnitID, UnitInit } from "../interface";
import { AiController } from "./ai-controller";
import { EffectsContext } from "./effects";
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

@injectable()
export class Battlefield {
  private unitsContext = inject(UnitContext);
  private mapContext = inject(MapContext);
  private effectsContext = inject(EffectsContext);
  private aiController = inject(AiController);

  readonly spellsContext = inject(SpellsContext);

  init(init: BattlefieldInit) {
    init.units.forEach(unit => this.unitsContext.addUnit(unit));
  }

  setUserControlledUnit(unitId: UnitID) {
    const unit = this.unitsContext.getUnitById(unitId);
    unit.userControlled = true;
  }

  setUnitDirection(unitId: UnitID, direction: Vector) {
    const unit = this.unitsContext.getUnitById(unitId);
    if (isNullVector(direction)) {
      delete unit.moveDirection;
    } else {
      unit.moveDirection = normVector(direction);
    }
  }

  setUnitShootAction(unitId: UnitID, targetPosition: Position) {
    const unit = this.unitsContext.getUnitById(unitId);

    const action = unit.actions[0];

    unit.activeAction = { action, speed: action.speed, targetPosition };
  }

  tick() {
    this.unitsContext.tickUnitsMove();

    this.effectsContext.tickEffects();

    this.aiController.tickAction();

    this.mapContext.tickProjectiles();
  }

  getState(): BattlefieldState {
    return {
      units: this.unitsContext.units,
      projectiles: this.mapContext.projectiles,
    };
  }

  get isFinished(): boolean {
    const actionableUnits = this.unitsContext.units.filter(x => x.hp > 0);

    return actionableUnits.every((x, _index, array) => x.team === array[0].team);
  }
}
