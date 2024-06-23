import { GameState } from "@rpg-village/bannerlords";

export enum PartyType {
  Villager = "villager",
  Lord = "lord",
}

export const getPartyType = (gameState: GameState, belongToEntityId: string) =>
  (gameState.villages[belongToEntityId] && PartyType.Villager) || (gameState.lords[belongToEntityId] && PartyType.Lord);
