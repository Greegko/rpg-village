import { injectable } from "inversify";

import { commandHandler } from "@core/command";

import { ActivityManager } from "@modules/activity";
import { BattleActivityType } from "@modules/battle";
import { PartyOwner, PartyService } from "@modules/party";

import {
  MapActivity,
  MapCommand,
  MapCommandBattleArgs,
  MapCommandExploreArgs,
  MapCommandTravelArgs,
} from "./interfaces";

@injectable()
export class MapCommandHandler {
  constructor(private activityManager: ActivityManager, private partyService: PartyService) {}

  @commandHandler(MapCommand.Travel)
  travelCommand(travelArgs: MapCommandTravelArgs) {
    this.activityManager.startPartyActivity(MapActivity.Travel, travelArgs);
  }

  @commandHandler(MapCommand.Explore)
  exploreCommand(exploreArgs: MapCommandExploreArgs) {
    this.activityManager.startPartyActivity(MapActivity.Explore, exploreArgs);
  }

  @commandHandler(MapCommand.Battle)
  battleCommand(battleArgs: MapCommandBattleArgs) {
    const parties = this.partyService.getPartiesOnLocation(battleArgs.locationId);

    const playerParty = parties.find(party => party.owner === PartyOwner.Player);
    const enemyParty = parties.find(party => party.owner === PartyOwner.Enemy);

    if (playerParty && enemyParty) {
      this.activityManager.startPartyActivity(BattleActivityType.Battle, {
        partyId: playerParty.id,
        involvedPartyId: enemyParty.id,
      });
    }
  }
}
