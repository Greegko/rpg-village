import { injectable, inject } from "inversify";
import { EventHandler, EventSystem } from "@core/event";
import { Unit, UnitEvent } from "@modules/unit";
import { GameEvent } from "@modules/game";
import { UnitStoreEvent, UnitStoreEventUpdateArgs } from './unit-store';
import { UnitEventDieArgs } from "public-api";

@injectable()
export class UnitEventHandler implements EventHandler {
  constructor(private eventSystem: EventSystem) {}

  init(eventSystem: EventSystem) {
    eventSystem.on(UnitStoreEvent.Update, (args: UnitStoreEventUpdateArgs) => this.updateUnit(args.unit));
    eventSystem.on(UnitEvent.Die, (args: UnitEventDieArgs) => this.unitDie(args.unit));
  }

  private updateUnit(unit: Unit) {
    if(unit.hp === 0) {
      this.eventSystem.fire(UnitEvent.Die, { unit: unit });
    }
  }

  private unitDie(unit: Unit) {
    this.eventSystem.fire(GameEvent.IncreaseDifficulty, { difficulty: unit.level });
  }
}
