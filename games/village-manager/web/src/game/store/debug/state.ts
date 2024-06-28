import { Command } from "@rpg-village/village-manager-core";

type CommandHistory = { turn: number; command: Command };

export interface GameDebugState {
  commandHistory: CommandHistory[];
}
