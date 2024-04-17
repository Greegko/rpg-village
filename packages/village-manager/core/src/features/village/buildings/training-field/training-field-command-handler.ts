import { injectable } from "inversify";

import { commandHandler } from "@rpg-village/core";
import { ActivityManager } from "@rpg-village/features/activity";

import { TrainingFieldActivity } from "./interface";
import { TrainingFieldCommand, TrainingFieldCommandArgs } from "./training-field-command";

@injectable()
export class TrainingFieldCommandHandler {
  constructor(private activityManager: ActivityManager) {}

  @commandHandler(TrainingFieldCommand.Train)
  upgradeItem(args: TrainingFieldCommandArgs) {
    this.activityManager.startActivity(TrainingFieldActivity.Train, {
      targetId: args.villageId,
      involvedTargetId: args.partyId,
    });
  }
}
