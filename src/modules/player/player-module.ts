import { Module } from "../../models";
import { PlayerStore } from "./player-store";
import { PlayerStash } from "./player-stash";

export const playerModule: Module = {
  stores: [{ scope: 'player', store: PlayerStore }],
  provides: [PlayerStash]
}
