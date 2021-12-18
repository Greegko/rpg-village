import { injectable } from "inversify";

import { commandHandler } from "@core/command";
import { ActivityManager } from "@modules/activity";
import { PartyService, PartyOwner } from "@modules/party";
import { BattleActivityType } from "@modules/battle";

import { WorldCommand, WorldActivity, WorldCommandBattleArgs } from "./interfaces";

@injectable()
export class WorldCommandHandler {
  constructor(private activityManager: ActivityManager, private partyService: PartyService) {}

  @commandHandler(WorldCommand.Travel)
  travelCommand(travelArgs: any) {
    this.activityManager.startPartyActivity(WorldActivity.Travel, travelArgs);
  }

  @commandHandler(WorldCommand.Explore)
  exploreCommand(exploreArgs: any) {
    this.activityManager.startPartyActivity(WorldActivity.Explore, exploreArgs);
  }

  @commandHandler(WorldCommand.Battle)
  battleCommand(battleArgs: WorldCommandBattleArgs) {
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
