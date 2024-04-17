import { injectable } from "inversify";

import { commandHandler } from "@core";

import { GameCommand } from "@features/game";

import { ActivityManager } from "./activity-manager";

@injectable()
export class ActivityCommandHandler {
  constructor(private activityManager: ActivityManager) {}

  @commandHandler(GameCommand.TurnCommand)
  runActivities() {
    this.activityManager.runActivites();
  }
}
