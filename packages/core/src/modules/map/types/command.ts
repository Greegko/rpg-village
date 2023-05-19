import "@core/command";

import { MapCommand, MapCommandBattleArgs, MapCommandExploreArgs, MapCommandTravelArgs } from "../interfaces";

declare module "@core/command" {
  interface CommandType {
    [MapCommand.Explore]: MapCommandExploreArgs;
    [MapCommand.Travel]: MapCommandTravelArgs;
    [MapCommand.Battle]: MapCommandBattleArgs;
  }
}
