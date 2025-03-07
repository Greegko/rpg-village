import { Position, isNullVector } from "@rpg-village/utils/node";
import { Vector, normVector } from "@rpg-village/utils/node";

import { MapObject } from "@/features/map";
import { Projectile } from "@/features/projectile";
import { Unit, UnitID } from "@/features/unit";

import { inject } from "../injection-container";
import { BattlefieldConfigToken } from "../interface";
import { AiController } from "./ai-controller";
import { EffectsContext } from "./effects";
import { MapContext } from "./map";
import { SpellsContext } from "./spells";
import { UnitContext } from "./unit";

export interface BattlefieldState {
  units: Unit[];
  mapObjects: MapObject[];
  projectiles: Projectile[];
}

export class Battlefield {
  private unitsContext = inject(UnitContext);
  private mapContext = inject(MapContext);
  private effectsContext = inject(EffectsContext);
  private aiController = inject(AiController);
  private config = inject(BattlefieldConfigToken);

  readonly spellsContext = inject(SpellsContext);

  constructor() {
    this.config.map.units.forEach(unit => this.unitsContext.addUnit(unit));
    this.config.map.mapObjects.forEach(mapObject => this.mapContext.addMapObject(mapObject));
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
      mapObjects: this.mapContext.mapObjects,
      projectiles: this.mapContext.projectiles,
    };
  }

  get isFinished(): boolean {
    const actionableUnits = this.unitsContext.units.filter(x => x.hp > 0);

    return actionableUnits.every((x, _index, array) => x.team === array[0].team);
  }
}
