import { PartyID } from "@modules/party";

export enum TrainingFieldCommand {
  Train = "training-field/train",
}

export interface TrainingFieldCommandArgs {
  partyId: PartyID;
}

declare module "@core/command" {
  export interface CommandType {
    [TrainingFieldCommand.Train]: TrainingFieldCommandArgs;
  }
}
