import { injectable } from "inversify";

import { eventHandler } from "@core";

import { ShopStore } from "@features/shop";
import { VillageBuilding, VillageEvent, VillageEventBuildingBuiltArgs, VillageStore } from "@features/village";

@injectable()
export class VillageShopEventHandler {
  constructor(private villageStore: VillageStore, private shopStore: ShopStore) {}

  @eventHandler(VillageEvent.BuildingBuilt)
  buildingBuilt({ buildingType, level }: VillageEventBuildingBuiltArgs) {
    if (buildingType === VillageBuilding.Shop) {
      this.villageStore.update(buildingType, shop => {
        if (shop) {
          return {
            shopId: shop.shopId,
            level,
          };
        }

        return {
          shopId: this.shopStore.add({ items: [] }).id,
          level: 1,
        };
      });
    }
  }
}
