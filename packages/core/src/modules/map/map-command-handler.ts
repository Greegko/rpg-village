import { injectable } from "inversify";

import { commandHandler } from "@core";

import { BattleActivityType } from "@modules/battle";
import { PartyActivityManager, PartyOwner } from "@modules/party";

import {
  MapActivity,
  MapCommand,
  MapCommandBattleArgs,
  MapCommandExploreArgs,
  MapCommandTravelArgs,
} from "./interfaces";
import { PartyMapService } from "./party-map-service";

@injectable()
export class MapCommandHandler {
  constructor(private playerActivityManager: PartyActivityManager, private partyMapService: PartyMapService) {}

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
}
