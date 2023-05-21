import { injectable } from "inversify";

import { commandHandler } from "@core";

import { PartyActivityManager } from "@modules/party";

import { TrainingFieldActivity } from "./interface";
import { TrainingFieldCommand, TrainingFieldCommandArgs } from "./training-field-command";

@injectable()
export class TrainingFieldCommandHandler {
  constructor(private partyActivityManager: PartyActivityManager) {}

  @commandHandler(TrainingFieldCommand.Train)
  upgradeItem(args: TrainingFieldCommandArgs) {
    this.partyActivityManager.startPartyActivity(TrainingFieldActivity.Train, args);
  }
}
