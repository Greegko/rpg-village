import { Command, GameState } from "@rpg-village/core";

export type AICommandGenerator = (state: GameState) => Command[];
export type StateUpdateCallback = (game: GameState) => void;
