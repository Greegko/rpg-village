import { injectable } from "inversify";
import { evolve, intersection, without } from "rambda";

import { commandHandler } from "@core";

import { BattleActivityType } from "@features/battle";
import { PartyActivityManager, PartyOwner, PartyService, PartyStore } from "@features/party";

import {
  MapActivity,
  MapCommand,
  MapCommandBattleArgs,
  MapCommandExploreArgs,
  MapCommandMergePartiesArgs,
  MapCommandSplitPartyArgs,
  MapCommandTravelArgs,
} from "./interfaces";
import { PartyMapService } from "./party-map-service";

@injectable()
export class MapCommandHandler {
  constructor(
    private partyStore: PartyStore,
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

  @commandHandler(MapCommand.SplitParty)
  splitPartyCommand(splitPartyArgs: MapCommandSplitPartyArgs) {
    const party = this.partyStore.get(splitPartyArgs.partyId);
    if (intersection(party.unitIds, splitPartyArgs.unitIds).length !== splitPartyArgs.unitIds.length) return;

    const partyLocation = this.partyMapService.getPartyLocation(splitPartyArgs.partyId);

    this.partyStore.update(
      party.id,
      evolve({
        unitIds: without(splitPartyArgs.unitIds),
      }),
    );

    const newParty = this.partyService.createParty({
      owner: party.owner,
      unitIds: splitPartyArgs.unitIds,
      activityId: undefined,
      stash: { items: [], resource: {} },
    });

    this.partyMapService.setLocation(newParty.id, partyLocation!.id);
  }
}
