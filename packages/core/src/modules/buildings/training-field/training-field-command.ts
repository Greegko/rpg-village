import { PartyID } from "@modules/party";

export enum TrainingFieldCommand {
  Train = "trainingField/train",
}

export interface TrainingFieldCommandArgs {
  partyId: PartyID;
}

declare module "../../../core/command/command-type" {
  interface CommandType {
    [TrainingFieldCommand.Train]: TrainingFieldCommandArgs;
  }
}
