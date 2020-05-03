import { PartyID } from "../../party/interfaces";
import { BattleID } from "./battle-id";

export type BattleStoreState = {
  id: BattleID;
  partyId: PartyID;
  defenderPartyId: PartyID;
}
