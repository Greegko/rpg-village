import { Town, TownCommand, TownCommandEnterTownArgs, TownCommandLeaveTownArgs, TownID } from "../interface";

declare module "@rpg-village/core/extend" {
  interface GameState {
    towns: Record<TownID, Town>;
  }

  interface CommandType {
    [TownCommand.EnterTown]: TownCommandEnterTownArgs;
    [TownCommand.LeaveTown]: TownCommandLeaveTownArgs;
  }
}
