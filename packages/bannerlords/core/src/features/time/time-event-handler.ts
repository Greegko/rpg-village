import { injectable } from "inversify";

import { EventSystem, GameEvent, GeneralGameStore, eventHandler } from "@rpg-village/core";

import { TimeEvent } from "./interface";

const ONE_DAY_PER_TURN = 10;

@injectable()
export class TimeEventHandler {
  constructor(private generatelStore: GeneralGameStore, private eventSystem: EventSystem) {}

  @eventHandler(GameEvent.Turn)
  newDayChecker() {
    if (this.generatelStore.getState().turn % ONE_DAY_PER_TURN === 0) {
      this.eventSystem.fire(TimeEvent.NewDay);
    }
  }
}
