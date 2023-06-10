import { PartyID } from "@features/party";

export enum BattleEvent {
  Finished = "battle/battle-finished",
}

export interface BattleFinishedActivityArgs {
  winnerPartyId: PartyID;
  looserPartyId: PartyID;
}

declare module "@core" {
  export interface EventType {
    [BattleEvent.Finished]: BattleFinishedActivityArgs;
  }
}
