import { GameEvent, eventHandler, inject, injectable } from "@rpg-village/core";

import { ActivityManager } from "./activity-manager";

@injectable()
export class ActivityCommandHandler {
  private activityManager = inject(ActivityManager);

  @eventHandler(GameEvent.Turn)
  runActivities() {
    this.activityManager.runActivites();
  }
}
