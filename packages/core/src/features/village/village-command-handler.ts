import { injectable } from "inversify";
import { append, find, head, values, whereEq } from "rambda";
import { generate } from "shortid";

import { commandHandler } from "@core";

import { ActivityManager, ActivityStore } from "@features/activity";
import { GameCommand, GeneralGameStore } from "@features/game";
import { MapLocationType, MapService, MapSize, PartyMapService } from "@features/map";
import { PartyOwner, PartyService } from "@features/party";
import { UnitStore, isAlive } from "@features/unit";

import {
  VillageActivity,
  VillageBuilding,
  VillageCommand,
  VillageCommandBuildHouseArgs,
  VillageCommandHealPartyArgs,
  VillageCommandHeroHireArgs,
} from "./interfaces";
import { heroFactory, newHeroCost } from "./lib";
import { VillageStashService } from "./village-stash-service";
import { VillageStore } from "./village-store";

@injectable()
export class VillageCommandHandler {
  constructor(
    private villageStore: VillageStore,
    private villageStash: VillageStashService,
    private partyService: PartyService,
    private unitStore: UnitStore,
    private mapService: MapService,
    private generalGameStore: GeneralGameStore,
    private partyMapService: PartyMapService,
    private activityManager: ActivityManager,
    private activityStore: ActivityStore,
  ) {}

  @commandHandler(VillageCommand.HireHero)
  hireHero(args: VillageCommandHeroHireArgs): void {
    const villageState = this.villageStore.getState();
    const heroesCount = villageState.heroes.map(unitId => this.unitStore.get(unitId)).filter(isAlive).length;
    const goldCost = newHeroCost(1 + heroesCount);

    if (this.villageStash.hasEnoughResource({ gold: goldCost }) && heroesCount < villageState.houses) {
      const heroId = this.unitStore.add(heroFactory()).id;

      this.villageStash.removeResource({ gold: goldCost });
      this.villageStore.update("heroes", append(heroId));

      const party = this.partyService.createParty({
        unitIds: [heroId],
        owner: PartyOwner.Player,
        stash: { resource: { gold: 0, soul: 0 }, items: [] },
      });

      this.partyMapService.setLocation(party.id, villageState.locationId);
    }
  }

  @commandHandler(VillageCommand.HealParty)
  healParty(healPartyArgs: VillageCommandHealPartyArgs): void {
    this.activityManager.startActivity(VillageActivity.Heal, {
      targetId: healPartyArgs.villageId,
      involvedTargetId: healPartyArgs.partyId,
    });
  }

  @commandHandler(GameCommand.NewGame)
  createVillage(): void {
    const map = this.mapService.createMap(MapLocationType.Village, MapSize.Endless, []);
    this.generalGameStore.set("worldMapId", map.id);

    this.villageStore.set("id", generate());
    this.villageStore.set("stash", { items: [], resource: { gold: 0, soul: 0 } });
    this.villageStore.set("locationId", head(map.mapLocationIds)!);
  }

  @commandHandler(VillageCommand.BuildHouse)
  buildHouse(args: VillageCommandBuildHouseArgs): void {
    const gold = (1 + this.villageStore.getState().houses) * 20;

    const activities = values(this.activityStore.getState());
    const buildActivity = find(
      whereEq({ name: VillageActivity.Build, startArgs: { targetBuilding: VillageBuilding.House } }),
      activities,
    );

    if (buildActivity !== undefined) return;
    if (!this.villageStash.hasEnoughResource({ gold })) return;

    this.activityManager.startActivity(VillageActivity.Build, {
      targetId: args.villageId,
      targetBuilding: VillageBuilding.House,
    });
    this.villageStash.removeResource({ gold });
  }
}
