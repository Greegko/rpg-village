import { injectable } from "inversify";
import { dec, evolve, find, values, whereEq } from "rambda";

import { commandHandler } from "@rpg-village/core";
import { ActivityManager, ActivityStore } from "@rpg-village/core/features/activity";
import { updateValueInList } from "@rpg-village/core/lib/update-value-in-list";

import { ShopItem } from "@features/buildings/shop";
import { EffectStatic } from "@features/effect";
import { MapLocationType, MapService, MapSize } from "@features/map";
import { Resource } from "@features/stash";
import { VillageActivity, VillageBuilding, VillageID, VillageService, VillageStore } from "@features/village";

import {
  VillageBuildingBuildShopArgs,
  VillageBuildingCommand,
  VillageBuildingCommandBuildBlacksmithArgs,
  VillageBuildingCommandBuildHouseArgs,
  VillageBuildingCommandBuildPortalSummoningStoneArgs,
  VillageBuildingCommandBuildRuneWorkshopArgs,
  VillageBuildingCommandBuildTrainingFieldArgs,
  VillageBuildingCommandGenerateShopItemsArgs,
  VillageBuildingCommandPortalSummoningStoneOpenPortalArgs,
  VillageBuildingCommandShopBuyItemArgs,
} from "./interfaces";

@injectable()
export class VillageBuildingsCommandHandler {
  constructor(
    private villageService: VillageService,
    private activityManager: ActivityManager,
    private activityStore: ActivityStore,
    private villageStore: VillageStore,
    private mapService: MapService,
  ) {}

  @commandHandler(VillageBuildingCommand.BuildBlacksmith)
  buildBlacksmith(args: VillageBuildingCommandBuildBlacksmithArgs): void {
    const gold = 100;

    this.buildBuilding(args.villageId, VillageBuilding.Blacksmith, { gold });
  }

  @commandHandler(VillageBuildingCommand.BuildRuneWorkshop)
  buildRuneWorkshop(args: VillageBuildingCommandBuildRuneWorkshopArgs): void {
    const gold = 100;

    this.buildBuilding(args.villageId, VillageBuilding.RuneWorkshop, { gold });
  }

  @commandHandler(VillageBuildingCommand.BuildShop)
  buildShopWorkshop(args: VillageBuildingBuildShopArgs): void {
    const gold = 100;

    this.buildBuilding(args.villageId, VillageBuilding.Shop, { gold });
  }

  @commandHandler(VillageBuildingCommand.BuildTrainingField)
  buildTrainingField(args: VillageBuildingCommandBuildTrainingFieldArgs): void {
    const gold = 100;

    this.buildBuilding(args.villageId, VillageBuilding.TrainingField, { gold });
  }

  @commandHandler(VillageBuildingCommand.BuildPortalSummoningStone)
  buildPortals(args: VillageBuildingCommandBuildPortalSummoningStoneArgs): void {
    const gold = 100;

    this.buildBuilding(args.villageId, VillageBuilding.PortalSummoningStone, { gold });
  }

  @commandHandler(VillageBuildingCommand.BuildHouse)
  buildHouse(args: VillageBuildingCommandBuildHouseArgs): void {
    const gold = (1 + (this.villageStore.get(args.villageId).buildings.houses || 0)) * 20;

    this.buildBuilding(args.villageId, VillageBuilding.House, { gold });
  }

  @commandHandler(VillageBuildingCommand.GenerateShopItems)
  generateShopItemsCommand({ villageId }: VillageBuildingCommandGenerateShopItemsArgs): void {
    const shop = this.villageService.getShop(villageId);
    if (!shop) return;

    const goldCost = shop.state.level * 50;

    const villageStash = this.villageService.getStash(villageId);

    if (!villageStash.hasEnoughResource({ gold: goldCost })) return;
    villageStash.removeResource({ gold: goldCost });

    shop.generateNewItems();
  }

  @commandHandler(VillageBuildingCommand.ShopBuyItem)
  buyItemFromShop(args: VillageBuildingCommandShopBuyItemArgs) {
    const shop = this.villageService.getShop(args.villageId);
    const item = shop.state.items.find(x => x.id === args.shopItemId);

    if (!item) return;

    const villageStash = this.villageService.getStash(args.villageId);
    const shopStash = shop.getStash();

    if (villageStash.hasEnoughResource(item.price)) {
      villageStash.removeResource(item.price);
      shopStash.addResource(item.price);

      const updateItem = (items: ShopItem[]) =>
        updateValueInList(items, item, x => (x.quantity > 1 ? evolve({ quantity: dec }, x) : null));

      shop.update(evolve({ items: updateItem }));

      villageStash.addItems([item.item]);
    }
  }

  @commandHandler(VillageBuildingCommand.PortalSummoningStoneOpenPortal)
  openPortal(args: VillageBuildingCommandPortalSummoningStoneOpenPortalArgs) {
    const portalSummoningStone = this.villageService.getPortalSummoningStone(args.villageId);
    if (!portalSummoningStone.state) return;

    const villageStash = this.villageService.getStash(args.villageId);
    const dungeonKey = villageStash.takeItem(args.dungeonKeyId);

    if (dungeonKey) {
      const map = this.mapService.createMap(
        MapLocationType.Portal,
        MapSize.Small,
        dungeonKey.effects as EffectStatic[],
      );
      portalSummoningStone.addPortal(map.mapLocationIds[0]);
    }
  }

  private buildBuilding(villageId: VillageID, targetBuilding: VillageBuilding, cost: Resource) {
    const activities = values(this.activityStore.getState());

    const villageStash = this.villageService.getStash(villageId);

    if (find(whereEq({ name: VillageActivity.Build, startArgs: { targetBuilding } }), activities) !== undefined) return;
    if (!villageStash.hasEnoughResource(cost)) return;

    this.activityManager.startActivity(VillageActivity.Build, { targetId: villageId, targetBuilding });
    villageStash.removeResource(cost);
  }
}
