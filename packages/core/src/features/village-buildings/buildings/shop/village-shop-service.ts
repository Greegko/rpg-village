import { injectable } from "inversify";
import { always, evolve, times } from "rambda";
import { generate } from "shortid";

import { commandHandler, eventHandler } from "@core";

import { ShopItem, ShopStore } from "@features/shop";
import {
  VillageBuilding,
  VillageEvent,
  VillageEventBuildingBuiltArgs,
  VillageStashService,
  VillageStore,
} from "@features/village";
import { AttackEffectType, EffectType, ItemType, Weapon } from "@models";

import { VillageBuildingsCommand } from "../../interfaces";

@injectable()
export class VillageShopService {
  constructor(
    private villageStore: VillageStore,
    private villageStashService: VillageStashService,
    private shopStore: ShopStore,
  ) {}

  @commandHandler(VillageBuildingsCommand.GenerateShopItems)
  generateShopItemsCommand(): void {
    const shop = this.villageStore.get("shop");
    if (!shop) return;

    const goldCost = shop.level * 50;

    if (!this.villageStashService.hasEnoughResource({ gold: goldCost })) return;

    this.villageStashService.removeResource({ gold: goldCost });

    this.generateNewShopItems();
  }

  @eventHandler(VillageEvent.BuildingBuilt)
  onShopCreation({ buildingType }: VillageEventBuildingBuiltArgs) {
    if (buildingType !== VillageBuilding.Shop) return;

    this.generateNewShopItems();
  }

  private generateNewShopItems(): void {
    const shop = this.villageStore.get("shop");

    const shopItems: ShopItem[] = [];

    times(() => {
      const swordWeapon: Weapon = {
        id: generate(),
        name: "Magic Name",
        effects: [{ effectType: AttackEffectType.Dmg, value: 10 * shop.level, type: EffectType.Static }],
        itemType: ItemType.Weapon,
      };

      const shopItem: ShopItem = { price: { gold: shop.level * 10 }, item: swordWeapon, quantity: 1, id: generate() };
      shopItems.push(shopItem);
    }, 30);

    this.shopStore.update(shop.shopId, evolve({ items: always(shopItems) }));
  }
}
