import { injectable } from "inversify";
import { always, times } from "rambda";
import { evolve } from "rambda";
import * as shortid from "shortid";

import { commandHandler } from "@core/command";
import { eventHandler } from "@core/event";

import { AttackEffectType, EffectType } from "@models/effect";
import { ItemType, Weapon } from "@models/item";
import { ShopItem, ShopStore } from "@modules/shop";

import { VillageCommand, VillageEvent, VillageEventBuildingBuiltArgs } from "./interfaces";
import { VillageStashService } from "./village-stash-service";
import { VillageStore } from "./village-store";

@injectable()
export class VillageShopService {
  constructor(
    private villageStore: VillageStore,
    private villageStashService: VillageStashService,
    private shopStore: ShopStore,
  ) {}

  @commandHandler(VillageCommand.GenerateShopItems)
  generateShopItemsCommand(): void {
    const shop = this.villageStore.get("shop");
    if (!shop) return;

    const goldCost = shop.level * 50;

    if (!this.villageStashService.hasEnoughResource({ gold: goldCost })) return;

    this.villageStashService.removeResource({ gold: goldCost });

    this.generateNewShopItems();
  }

  @eventHandler(VillageEvent.BuildingBuilt)
  onShopCreation(buildingBuiltEvent: VillageEventBuildingBuiltArgs) {
    if (buildingBuiltEvent.buildingType !== "shop") return;

    this.generateNewShopItems();
  }

  private generateNewShopItems(): void {
    const shop = this.villageStore.get("shop");

    const shopItems: ShopItem[] = [];

    times(() => {
      const swordWeapon: Weapon = {
        id: shortid(),
        name: "Magic Name",
        effects: [{ effectType: AttackEffectType.Dmg, value: 10 * shop.level, type: EffectType.Static }],
        itemType: ItemType.Weapon,
      };

      const shopItem: ShopItem = { price: { gold: shop.level * 10 }, item: swordWeapon, quantity: 1, id: shortid() };
      shopItems.push(shopItem);
    }, 30);

    this.shopStore.update(shop.shopId, evolve({ items: always(shopItems) }));
  }
}
