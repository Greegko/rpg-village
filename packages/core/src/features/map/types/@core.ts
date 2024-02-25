import { PartyID } from "@features/party";

import {
  MapCommand,
  MapCommandBattleArgs,
  MapCommandExploreArgs,
  MapCommandMergePartiesArgs,
  MapCommandSplitPartyArgs,
  MapCommandTravelArgs,
} from "../interfaces";
import { Map, MapEvent, MapEventNewLocationArgs, MapID, MapLocation, MapLocationID } from "../interfaces";

export type PartyEventArrivedToLocationArgs = {
  partyId: PartyID;
  locationId: MapLocationID;
};

declare module "@core" {
  interface CommandType {
    [MapCommand.Explore]: MapCommandExploreArgs;
    [MapCommand.Travel]: MapCommandTravelArgs;
    [MapCommand.Battle]: MapCommandBattleArgs;
    [MapCommand.MergeParties]: MapCommandMergePartiesArgs;
    [MapCommand.SplitParty]: MapCommandSplitPartyArgs;
  }

  interface EventType {
    [MapEvent.NewLocation]: MapEventNewLocationArgs;
    [MapEvent.PartyArrivedToLocation]: PartyEventArrivedToLocationArgs;
  }

  interface GameState {
    maps: Record<MapID, Map>;
    mapLocations: Record<MapLocationID, MapLocation>;
  }
}
