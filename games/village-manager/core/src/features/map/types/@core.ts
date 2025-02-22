import { PartyID } from "@features/party";

import {
  Map,
  MapCommand,
  MapCommandBattleArgs,
  MapCommandExploreArgs,
  MapCommandMergePartiesArgs,
  MapCommandSplitPartyArgs,
  MapCommandTravelArgs,
  MapEvent,
  MapEventNewLocationArgs,
  MapID,
  MapLocation,
  MapLocationID,
} from "../interfaces";

export type PartyEventArrivedToLocationArgs = {
  partyId: PartyID;
  locationId: MapLocationID;
};

declare module "@rpg-village/core/extend" {
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
