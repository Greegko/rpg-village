import { PartyID } from "@features/party";
import { VillageID } from "@features/village";

export enum TrainingFieldCommand {
  Train = "training-field/train",
}

export interface TrainingFieldCommandArgs {
  villageId: VillageID;
  partyId: PartyID;
}
