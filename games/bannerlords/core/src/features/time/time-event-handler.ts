import { inject, injectable } from "@rpg-village/core";
import { EventSystem, GameEvent, GeneralGameStore, eventHandler } from "@rpg-village/core";

import { TimeEvent } from "./interface";

const ONE_DAY_PER_TURN = 24;

@injectable()
export class TimeEventHandler {
  private generatelStore = inject(GeneralGameStore);
  private eventSystem = inject(EventSystem);

  @eventHandler(GameEvent.Turn)
  newDayChecker() {
    if (this.generatelStore.getState().turn % ONE_DAY_PER_TURN === 0) {
      this.eventSystem.fire(TimeEvent.NewDay);
    }
  }
}
