import { injectable } from "inversify";

import { commandHandler } from "@core/command";

import { ActivityManager } from "@modules/activity";

import { TrainingFieldActivity } from "./interface";
import { TrainingFieldCommand, TrainingFieldCommandArgs } from "./training-field-command";

@injectable()
export class TrainingFieldCommandHandler {
  constructor(private activityManager: ActivityManager) {}

  @commandHandler(TrainingFieldCommand.Train)
  upgradeItem(args: TrainingFieldCommandArgs) {
    this.activityManager.startPartyActivity(TrainingFieldActivity.Train, args);
  }
}
