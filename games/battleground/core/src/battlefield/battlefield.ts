import { Random, Vector, normVector } from "../utils";
import { Context } from "./context";
import { AiController } from "./controllers/ai";
import { EffectsContext } from "./effects";
import { BattlefieldConfig, Position, ProjectileNode, ResourceManager, Unit, UnitID, UnitInit } from "./interface";
import { MapContext } from "./map";
import { SpellsContext } from "./spells";
import { UnitContext } from "./unit";

export interface BattlefieldState {
  units: Unit[];
  projectiles: ProjectileNode[];
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
      aiController: new AiController(this.context),
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
    this.context.aiController.tickAction();

    this.context.unit.tickUnitsMove();

    this.context.aiController.tickAction();

    this.context.effect.tickEffects();

    this.context.map.tickProjectiles();
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
