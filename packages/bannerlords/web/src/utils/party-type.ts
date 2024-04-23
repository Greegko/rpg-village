import { GameState, Party } from "@rpg-village/bannerlords";

export enum PartyType {
  Villager = "villager",
  Lord = "lord",
}

export type PartyTypes = Record<PartyType, Party[]>;

export const getPartyType = (gameState: GameState, entityId: string) =>
  (gameState.villages[entityId] && PartyType.Villager) || (gameState.lords[entityId] && PartyType.Lord);
