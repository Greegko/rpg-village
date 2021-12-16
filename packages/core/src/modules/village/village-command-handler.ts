import { append, inc } from "ramda";
import { injectable } from "inversify";
import { CommandSystem } from "@core/command";
import { PartyService, PartyOwner } from "@modules/party";
import { GameCommand } from "@modules/game";
import { MapLocationType, WorldMap } from "@modules/world";
import { Item } from "@models/item";
import { Resource } from "@models/resource";
import { UnitStore } from "@modules/unit";
import { ActivityManager } from "@modules/activity";
import { newBuildingCost, newHeroCost, heroFactory } from "./lib";
import { VillageCommand } from "./interfaces";
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

  init(commandSystem: CommandSystem) {
    commandSystem.on(VillageCommand.BuildBlacksmith, () => this.buildBlacksmith());
    commandSystem.on(VillageCommand.BuildHouse, () => this.buildHouse());
    commandSystem.on(VillageCommand.GenerateGold, () => this.generateGold());
    commandSystem.on(VillageCommand.HireHero, () => this.hireHero());
    commandSystem.on(VillageCommand.HealParty, (args: any) => this.healParty(args));
    commandSystem.on(GameCommand.NewGame, () => this.createVillage());
  }

  createVillage(): void {
    const locationId = this.worldMap.createLocation(0, 0, true, MapLocationType.Village);
    this.worldMap.revealNewLocations(locationId);
    this.villageStore.set("stash", { items: [], resource: { gold: 0 } });
    this.villageStore.set("locationId", locationId);
  }

  buildHouse(): void {
    const goldCost = newBuildingCost(1 + this.villageStore.getState().houses);

    if (this.villageStash.hasEnoughResource({ gold: goldCost })) {
      this.villageStore.update("houses", inc);
      this.villageStash.removeResource({ gold: goldCost });
    }
  }

  buildBlacksmith(): void {
    const goldCost = 100;

    if (this.villageStash.hasEnoughResource({ gold: goldCost })) {
      this.villageStore.update("blacksmith", inc);
      this.villageStash.removeResource({ gold: goldCost });
    }
  }

  generateGold(): void {
    this.villageStash.addResource({ gold: 5 });
  }

  hireHero(): void {
    const villageState = this.villageStore.getState();
    const heroesCount = villageState.heroes.length;
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

  healParty(healPartyArgs: any): void {
    this.activityManager.startPartyActivity(VillageCommand.HealParty, healPartyArgs);
  }

  stashResource(resource: Resource): void {
    this.villageStash.addResource(resource);
  }

  stashItems(items: Item[]): void {
    this.villageStash.addItems(items);
  }
}
