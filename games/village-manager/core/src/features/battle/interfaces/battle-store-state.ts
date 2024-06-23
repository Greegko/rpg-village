import { PartyID } from "@features/party";

import { BattleID } from "./battle-id";

export type BattleStoreState = {
  id: BattleID;
  partyId: PartyID;
  defenderPartyId: PartyID;
};
