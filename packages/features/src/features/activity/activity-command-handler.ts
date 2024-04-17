import { injectable } from "inversify";

import { eventHandler } from "@rpg-village/core";
import { GameEvent } from "@rpg-village/core/features/game";

import { ActivityManager } from "./activity-manager";

@injectable()
export class ActivityCommandHandler {
  constructor(private activityManager: ActivityManager) {}

  @eventHandler(GameEvent.Turn)
  runActivities() {
    this.activityManager.runActivites();
  }
}
