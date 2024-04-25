import { Town, TownCommand, TownCommandEnterTownArgs, TownCommandLeaveTownArgs, TownID } from "../interface";

declare module "@rpg-village/core" {
  interface GameState {
    towns: Record<TownID, Town>;
  }

  interface CommandType {
    [TownCommand.EnterTown]: TownCommandEnterTownArgs;
    [TownCommand.LeaveTown]: TownCommandLeaveTownArgs;
  }
}
