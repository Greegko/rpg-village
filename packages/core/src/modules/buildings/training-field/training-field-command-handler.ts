import { injectable } from "inversify";

import { commandHandler } from "@core/command";

import { ActivityManager } from "@modules/activity";
import { TrainingFieldCommand, TrainingFieldCommandArgs } from "./training-field-command";
import { TrainingFieldActivity } from "./interface";

@injectable()
export class TrainingFieldCommandHandler {
  constructor(private activityManager: ActivityManager) {}

  @commandHandler(TrainingFieldCommand.Train)
  upgradeItem(args: TrainingFieldCommandArgs) {
    this.activityManager.startPartyActivity(TrainingFieldActivity.Train, args);
  }
}
