import {
  MapCommand,
  MapCommandBattleArgs,
  MapCommandExploreArgs,
  MapCommandMergePartiesArgs,
  MapCommandSplitPartyArgs,
  MapCommandTravelArgs,
} from "../interfaces";

declare module "@core" {
  export interface CommandType {
    [MapCommand.Explore]: MapCommandExploreArgs;
    [MapCommand.Travel]: MapCommandTravelArgs;
    [MapCommand.Battle]: MapCommandBattleArgs;
    [MapCommand.MergeParties]: MapCommandMergePartiesArgs;
    [MapCommand.SplitParty]: MapCommandSplitPartyArgs;
  }
}
