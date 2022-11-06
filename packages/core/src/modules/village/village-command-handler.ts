import { injectable } from "inversify";
import { append, head, inc } from "ramda";

import { commandHandler } from "@core/command";

import { ActivityManager } from "@modules/activity";
import { GameCommand, GeneralGameStore } from "@modules/game";
import { MapLocationType, MapService } from "@modules/map";
import { PartyOwner, PartyService } from "@modules/party";
import { UnitStore, isAlive } from "@modules/unit";

import { VillageActivity, VillageCommand, VillageCommandHealPartyArgs } from "./interfaces";
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
    private mapService: MapService,
    private generalGameStore: GeneralGameStore,
  ) {}

  @commandHandler(VillageCommand.BuildHouse)
  buildHouse(): void {
    const goldCost = newBuildingCost(1 + this.villageStore.getState().houses);

    if (this.villageStash.hasEnoughResource({ gold: goldCost })) {
      this.villageStore.update("houses", inc);
      this.villageStash.removeResource({ gold: goldCost });
    }
  }

  @commandHandler(VillageCommand.BuildBlacksmith)
  buildBlacksmith(): void {
    const goldCost = 100;

    if (this.villageStash.hasEnoughResource({ gold: goldCost })) {
      this.villageStore.update("blacksmith", inc);
      this.villageStash.removeResource({ gold: goldCost });
    }
  }

  @commandHandler(VillageCommand.BuildRuneWorkshop)
  buildRuneWorkshop(): void {
    const goldCost = 100;

    if (this.villageStash.hasEnoughResource({ gold: goldCost })) {
      this.villageStore.update("runeWorkshop", inc);
      this.villageStash.removeResource({ gold: goldCost });
    }
  }

  @commandHandler(VillageCommand.BuildTrainingField)
  buildTrainingField(): void {
    const goldCost = 100;

    if (this.villageStash.hasEnoughResource({ gold: goldCost })) {
      this.villageStore.update("trainingField", inc);
      this.villageStash.removeResource({ gold: goldCost });
    }
  }

  @commandHandler(VillageCommand.BuildPortalSummonerStone)
  buildPortals(): void {
    const goldCost = 100;

    if (this.villageStash.hasEnoughResource({ gold: goldCost })) {
      this.villageStore.update("portals", inc);
      this.villageStash.removeResource({ gold: goldCost });
    }
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
      this.partyService.createParty({
        locationId: this.villageStore.getState().locationId,
        unitIds: [heroId],
        owner: PartyOwner.Player,
        stash: { resource: { gold: 0 }, items: [] },
      });
    }
  }

  @commandHandler(VillageCommand.HealParty)
  healParty(healPartyArgs: VillageCommandHealPartyArgs): void {
    this.activityManager.startPartyActivity(VillageActivity.Heal, healPartyArgs);
  }

  @commandHandler(GameCommand.NewGame)
  createVillage(): void {
    const map = this.mapService.createMap(MapLocationType.Village);
    this.generalGameStore.set("worldMapId", map.id);

    this.villageStore.set("stash", { items: [], resource: { gold: 0, soul: 0 } });
    this.villageStore.set("locationId", head(map.mapLocationIds)!);
  }
}
