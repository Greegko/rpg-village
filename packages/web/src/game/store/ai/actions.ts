import { PartyID } from "@rpg-village/core";

import { setGameStore } from "../game-store";
import { PartyActionType } from "./state";

export function setPartyAction(partyId: PartyID, actionType: PartyActionType, args?: object) {
  setGameStore("ai", "partyStates", partyId, "action", { type: actionType, args });
}

export function clearPartyAction(partyId: PartyID) {
  setGameStore("ai", "partyStates", partyId, {});
}

export function setAutoExplore(partyId: PartyID, enable: boolean) {
  setGameStore("ai", "partyStates", partyId, "autoExplore", enable);
}
