import { injectable } from "inversify";
import { find, values, whereEq } from "rambda";

import { commandHandler } from "@core";

import { ActivityManager, ActivityStore } from "@features/activity";
import { VillageActivity, VillageBuilding, VillageStashService } from "@features/village";
import { Resource } from "@models";

import { VillageBuildingsCommand } from "./interfaces";

@injectable()
export class VillageBuildingsCommandHandler {
  constructor(
    private villageStash: VillageStashService,
    private activityManager: ActivityManager,
    private activityStore: ActivityStore,
  ) {}

  @commandHandler(VillageBuildingsCommand.BuildBlacksmith)
  buildBlacksmith(): void {
    const gold = 100;

    this.buildBuilding(VillageBuilding.Blacksmith, { gold });
  }

  @commandHandler(VillageBuildingsCommand.BuildRuneWorkshop)
  buildRuneWorkshop(): void {
    const gold = 100;

    this.buildBuilding(VillageBuilding.RuneWorkshop, { gold });
  }

  @commandHandler(VillageBuildingsCommand.BuildShop)
  buildShopWorkshop(): void {
    const gold = 100;

    this.buildBuilding(VillageBuilding.Shop, { gold });
  }

  @commandHandler(VillageBuildingsCommand.BuildTrainingField)
  buildTrainingField(): void {
    const gold = 100;

    this.buildBuilding(VillageBuilding.TrainingField, { gold });
  }

  @commandHandler(VillageBuildingsCommand.BuildPortalSummonerStone)
  buildPortals(): void {
    const gold = 100;

    this.buildBuilding(VillageBuilding.Portals, { gold });
  }

  private buildBuilding(targetBuilding: VillageBuilding, cost: Resource) {
    const activities = values(this.activityStore.getState());

    if (find(whereEq({ name: VillageActivity.Build, startArgs: { targetBuilding } }), activities) !== undefined) return;
    if (!this.villageStash.hasEnoughResource(cost)) return;

    this.activityManager.startActivity(VillageActivity.Build, { targetBuilding });
    this.villageStash.removeResource(cost);
  }
}
