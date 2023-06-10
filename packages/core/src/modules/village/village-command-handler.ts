import { injectable } from "inversify";
import { append, find, head, values, whereEq } from "rambda";

import { commandHandler } from "@core";

import { ActivityManager, ActivityStore } from "@features/activity";
import { PartyActivityManager, PartyOwner, PartyService } from "@features/party";
import { UnitStore, isAlive } from "@features/unit";
import { Resource } from "@models";
import { GameCommand, GeneralGameStore } from "@modules/game";
import { MapLocationType, MapService, MapSize, PartyMapService } from "@modules/map";

import { VillageActivity, VillageBuilding, VillageCommand, VillageCommandHealPartyArgs } from "./interfaces";
import { heroFactory, newBuildingCost, newHeroCost } from "./lib";
import { VillageStashService } from "./village-stash-service";
import { VillageStore } from "./village-store";

@injectable()
export class VillageCommandHandler {
  constructor(
    private villageStore: VillageStore,
    private villageStash: VillageStashService,
    private partyService: PartyService,
    private unitStore: UnitStore,
    private activityManager: ActivityManager,
    private playerActivityManager: PartyActivityManager,
    private activityStore: ActivityStore,
    private mapService: MapService,
    private generalGameStore: GeneralGameStore,
    private partyMapService: PartyMapService,
  ) {}

  @commandHandler(VillageCommand.BuildHouse)
  buildHouse(): void {
    const gold = newBuildingCost(1 + this.villageStore.getState().houses);

    this.buildBuilding("houses", { gold });
  }

  @commandHandler(VillageCommand.BuildBlacksmith)
  buildBlacksmith(): void {
    const gold = 100;

    this.buildBuilding("blacksmith", { gold });
  }

  @commandHandler(VillageCommand.BuildRuneWorkshop)
  buildRuneWorkshop(): void {
    const gold = 100;

    this.buildBuilding("runeWorkshop", { gold });
  }

  @commandHandler(VillageCommand.BuildShop)
  buildShopWorkshop(): void {
    const gold = 100;

    this.buildBuilding("shop", { gold });
  }

  @commandHandler(VillageCommand.BuildTrainingField)
  buildTrainingField(): void {
    const gold = 100;

    this.buildBuilding("trainingField", { gold });
  }

  @commandHandler(VillageCommand.BuildPortalSummonerStone)
  buildPortals(): void {
    const gold = 100;

    this.buildBuilding("portals", { gold });
  }

  @commandHandler(VillageCommand.HireHero)
  hireHero(): void {
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
    this.playerActivityManager.startPartyActivity(VillageActivity.Heal, healPartyArgs);
  }

  @commandHandler(GameCommand.NewGame)
  createVillage(): void {
    const map = this.mapService.createMap(MapLocationType.Village, MapSize.Endless, []);
    this.generalGameStore.set("worldMapId", map.id);

    this.villageStore.set("stash", { items: [], resource: { gold: 0, soul: 0 } });
    this.villageStore.set("locationId", head(map.mapLocationIds)!);
  }

  private buildBuilding(targetBuilding: VillageBuilding, cost: Resource) {
    const activities = values(this.activityStore.getState());

    if (find(whereEq({ name: VillageActivity.Build, startArgs: { targetBuilding } }), activities) !== undefined) return;
    if (!this.villageStash.hasEnoughResource(cost)) return;

    this.activityManager.startActivity(VillageActivity.Build, { targetBuilding });
    this.villageStash.removeResource(cost);
  }
}
