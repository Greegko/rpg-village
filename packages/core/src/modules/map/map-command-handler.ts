import { injectable } from "inversify";

import { commandHandler } from "@core/command";
import { ActivityManager } from "@modules/activity";
import { PartyService, PartyOwner } from "@modules/party";
import { BattleActivityType } from "@modules/battle";

import { MapCommand, MapActivity, MapCommandBattleArgs } from "./interfaces";

@injectable()
export class MapCommandHandler {
  constructor(private activityManager: ActivityManager, private partyService: PartyService) {}

  @commandHandler(MapCommand.Travel)
  travelCommand(travelArgs: any) {
    this.activityManager.startPartyActivity(MapActivity.Travel, travelArgs);
  }

  @commandHandler(MapCommand.Explore)
  exploreCommand(exploreArgs: any) {
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
