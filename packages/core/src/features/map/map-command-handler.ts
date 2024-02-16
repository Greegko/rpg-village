import { injectable } from "inversify";

import { commandHandler } from "@core";

import { BattleActivityType } from "@features/battle";
import { PartyActivityManager, PartyOwner, PartyService } from "@features/party";

import {
  MapActivity,
  MapCommand,
  MapCommandBattleArgs,
  MapCommandExploreArgs,
  MapCommandMergePartiesArgs,
  MapCommandTravelArgs,
} from "./interfaces";
import { PartyMapService } from "./party-map-service";

@injectable()
export class MapCommandHandler {
  constructor(
    private partyService: PartyService,
    private playerActivityManager: PartyActivityManager,
    private partyMapService: PartyMapService,
  ) {}

  @commandHandler(MapCommand.Travel)
  travelCommand(travelArgs: MapCommandTravelArgs) {
    this.playerActivityManager.startPartyActivity(MapActivity.Travel, travelArgs);
  }

  @commandHandler(MapCommand.Explore)
  exploreCommand(exploreArgs: MapCommandExploreArgs) {
    this.playerActivityManager.startPartyActivity(MapActivity.Explore, exploreArgs);
  }

  @commandHandler(MapCommand.Battle)
  battleCommand(battleArgs: MapCommandBattleArgs) {
    const parties = this.partyMapService.getPartiesOnLocation(battleArgs.locationId);

    const playerParty = parties.find(party => party.owner === PartyOwner.Player);
    const enemyParty = parties.find(party => party.owner === PartyOwner.Enemy);

    if (playerParty && enemyParty) {
      this.playerActivityManager.startPartyActivity(BattleActivityType.Battle, {
        partyId: playerParty.id,
        involvedPartyId: enemyParty.id,
      });
    }
  }

  @commandHandler(MapCommand.MergeParties)
  mergePartiesCommand(mergePartiesArgs: MapCommandMergePartiesArgs) {
    const partyLocation = this.partyMapService.getPartyLocation(mergePartiesArgs.partyId);
    const otherPartyLocation = this.partyMapService.getPartyLocation(mergePartiesArgs.otherPartyId);

    if (partyLocation !== otherPartyLocation) return;

    this.partyService.mergeWithParty(mergePartiesArgs.partyId, mergePartiesArgs.otherPartyId);
  }
}
