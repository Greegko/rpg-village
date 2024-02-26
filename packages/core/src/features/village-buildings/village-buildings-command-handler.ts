import { injectable } from "inversify";
import { find, values, whereEq } from "rambda";

import { commandHandler } from "@core";

import { ActivityManager, ActivityStore } from "@features/activity";
import { VillageActivity, VillageBuilding, VillageID, VillageStashService } from "@features/village";
import { Resource } from "@models";

import {
  VillageBuildingBuildShopArgs,
  VillageBuildingCommandBuildBlacksmithArgs,
  VillageBuildingCommandBuildPortalSummonerStoneArgs,
  VillageBuildingCommandBuildRuneWorkshopArgs,
  VillageBuildingCommandBuildTrainingFieldArgs,
  VillageBuildingsCommand,
} from "./interfaces";

@injectable()
export class VillageBuildingsCommandHandler {
  constructor(
    private villageStash: VillageStashService,
    private activityManager: ActivityManager,
    private activityStore: ActivityStore,
  ) {}

  @commandHandler(VillageBuildingsCommand.BuildBlacksmith)
  buildBlacksmith(args: VillageBuildingCommandBuildBlacksmithArgs): void {
    const gold = 100;

    this.buildBuilding(args.villageId, VillageBuilding.Blacksmith, { gold });
  }

  @commandHandler(VillageBuildingsCommand.BuildRuneWorkshop)
  buildRuneWorkshop(args: VillageBuildingCommandBuildRuneWorkshopArgs): void {
    const gold = 100;

    this.buildBuilding(args.villageId, VillageBuilding.RuneWorkshop, { gold });
  }

  @commandHandler(VillageBuildingsCommand.BuildShop)
  buildShopWorkshop(args: VillageBuildingBuildShopArgs): void {
    const gold = 100;

    this.buildBuilding(args.villageId, VillageBuilding.Shop, { gold });
  }

  @commandHandler(VillageBuildingsCommand.BuildTrainingField)
  buildTrainingField(args: VillageBuildingCommandBuildTrainingFieldArgs): void {
    const gold = 100;

    this.buildBuilding(args.villageId, VillageBuilding.TrainingField, { gold });
  }

  @commandHandler(VillageBuildingsCommand.BuildPortalSummonerStone)
  buildPortals(args: VillageBuildingCommandBuildPortalSummonerStoneArgs): void {
    const gold = 100;

    this.buildBuilding(args.villageId, VillageBuilding.Portals, { gold });
  }

  private buildBuilding(villageId: VillageID, targetBuilding: VillageBuilding, cost: Resource) {
    const activities = values(this.activityStore.getState());

    if (find(whereEq({ name: VillageActivity.Build, startArgs: { targetBuilding } }), activities) !== undefined) return;
    if (!this.villageStash.hasEnoughResource(cost)) return;

    this.activityManager.startActivity(VillageActivity.Build, { targetId: villageId, targetBuilding });
    this.villageStash.removeResource(cost);
  }
}
