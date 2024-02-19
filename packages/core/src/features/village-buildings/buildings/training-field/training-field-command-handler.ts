import { injectable } from "inversify";

import { commandHandler } from "@core";

import { ActivityManager } from "@features/activity";

import { TrainingFieldActivity } from "./interface";
import { TrainingFieldCommand, TrainingFieldCommandArgs } from "./training-field-command";

@injectable()
export class TrainingFieldCommandHandler {
  constructor(private activityManager: ActivityManager) {}

  @commandHandler(TrainingFieldCommand.Train)
  upgradeItem(args: TrainingFieldCommandArgs) {
    this.activityManager.startActivity(TrainingFieldActivity.Train, args);
  }
}
