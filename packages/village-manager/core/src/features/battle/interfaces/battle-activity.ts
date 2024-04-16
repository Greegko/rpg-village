import { PartyID } from "@features/party";

export enum BattleActivityType {
  Battle = "battle",
}

export interface BattleFinishedActivityArgs {
  winnerPartyId: PartyID;
  looserPartyId: PartyID;
}
