import { MapCommand, MapCommandBattleArgs, MapCommandExploreArgs, MapCommandTravelArgs } from "../interfaces";

declare module "@core" {
  export interface CommandType {
    [MapCommand.Explore]: MapCommandExploreArgs;
    [MapCommand.Travel]: MapCommandTravelArgs;
    [MapCommand.Battle]: MapCommandBattleArgs;
  }
}
