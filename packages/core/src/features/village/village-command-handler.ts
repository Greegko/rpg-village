import { injectable } from "inversify";
import { append, find, head, values, whereEq } from "rambda";

import { commandHandler } from "@core";

import { ActivityManager, ActivityStore } from "@features/activity";
import { GameCommand, GeneralGameStore } from "@features/game";
import { MapLocationType, MapService, MapSize, PartyMapService } from "@features/map";
import { PartyActivityManager, PartyOwner, PartyService } from "@features/party";
import { UnitStore, isAlive } from "@features/unit";
import { Resource } from "@models";

import { VillageActivity, VillageBuilding, VillageCommand, VillageCommandHealPartyArgs } from "./interfaces";
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
    private playerActivityManager: PartyActivityManager,
    private mapService: MapService,
    private generalGameStore: GeneralGameStore,
    private partyMapService: PartyMapService,
    private activityManager: ActivityManager,
    private activityStore: ActivityStore,
  ) {}

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
        activityId: undefined,
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

  @commandHandler(VillageCommand.BuildHouse)
  buildHouse(): void {
    const gold = (1 + this.villageStore.getState().houses) * 20;

    this.buildBuilding(VillageBuilding.House, { gold });
  }

  private buildBuilding(targetBuilding: VillageBuilding, cost: Resource) {
    const activities = values(this.activityStore.getState());

    if (find(whereEq({ name: VillageActivity.Build, startArgs: { targetBuilding } }), activities) !== undefined) return;
    if (!this.villageStash.hasEnoughResource(cost)) return;

    this.activityManager.startActivity(VillageActivity.Build, { targetBuilding });
    this.villageStash.removeResource(cost);
  }
}
