import { PartyID } from "@features/party";

export enum TrainingFieldCommand {
  Train = "training-field/train",
}

export interface TrainingFieldCommandArgs {
  partyId: PartyID;
}

declare module "@core" {
  export interface CommandType {
    [TrainingFieldCommand.Train]: TrainingFieldCommandArgs;
  }
}
