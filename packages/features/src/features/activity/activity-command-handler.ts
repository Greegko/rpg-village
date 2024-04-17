import { injectable } from "inversify";

import { GameEvent, eventHandler } from "@rpg-village/core";

import { ActivityManager } from "./activity-manager";

@injectable()
export class ActivityCommandHandler {
  constructor(private activityManager: ActivityManager) {}

  @eventHandler(GameEvent.Turn)
  runActivities() {
    this.activityManager.runActivites();
  }
}
