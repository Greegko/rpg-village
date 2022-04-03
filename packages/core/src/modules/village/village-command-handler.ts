import { append, inc } from "ramda";
import { injectable } from "inversify";

import { commandHandler } from "@core/command";
import { PartyService, PartyOwner } from "@modules/party";
import { GameCommand } from "@modules/game";
import { MapLocationType, WorldMap } from "@modules/world";
import { isAlive, UnitStore } from "@modules/unit";
import { ActivityManager } from "@modules/activity";

import { newBuildingCost, newHeroCost, heroFactory } from "./lib";
import { VillageCommand, VillageCommandHealPartyArgs, VillageActivity } from "./interfaces";
import { VillageStore } from "./village-store";
import { VillageStashService } from "./village-stash-service";

@injectable()
export class VillageCommandHandler {
  constructor(
    private villageStore: VillageStore,
    private villageStash: VillageStashService,
    private partyService: PartyService,
    private unitStore: UnitStore,
    private activityManager: ActivityManager,
    private worldMap: WorldMap,
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

  @commandHandler(VillageCommand.BuildTrainingField)
  buildTrainingField(): void {
    const goldCost = 100;

    if (this.villageStash.hasEnoughResource({ gold: goldCost })) {
      this.villageStore.update("trainingField", inc);
      this.villageStash.removeResource({ gold: goldCost });
    }
  }

  @commandHandler(VillageCommand.GenerateGold)
  generateGold(): void {
    this.villageStash.addResource({ gold: 5 });
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
    const locationId = this.worldMap.createLocation(0, 0, true, MapLocationType.Village);
    this.worldMap.revealNewLocations(locationId);
    this.villageStore.set("stash", { items: [], resource: { gold: 0 } });
    this.villageStore.set("locationId", locationId);
  }
}
