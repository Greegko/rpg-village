import { PartyID } from "../../party/interfaces";
import { BattleID } from "./battle-id";

export type BattleStoreState = {
  id: BattleID;
  attackerPartyId: PartyID;
  defenderPartyId: PartyID;
}
