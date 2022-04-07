import { PartyID } from "@modules/party";

export enum TrainingFieldCommand {
  Train = "training-field/train",
}

export interface TrainingFieldCommandArgs {
  partyId: PartyID;
}

declare module "../../../../core/command/command-type" {
  interface CommandType {
    [TrainingFieldCommand.Train]: TrainingFieldCommandArgs;
  }
}
