import { PartyID } from "@features/party";

import { VillageID } from "../../interfaces";

export enum TrainingFieldCommand {
  Train = "training-field/train",
}

export interface TrainingFieldCommandArgs {
  villageId: VillageID;
  partyId: PartyID;
}
