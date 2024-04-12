import { always, evolve, inc, times } from "rambda";

import { generateId } from "@lib/generate-id";

import { StashHandler } from "@features/stash";
import { AttackEffectType, EffectType, ItemType, Weapon } from "@models";

import { Shop, ShopItem } from "./interface";

export interface ShopHandlerDelegator {
  get: () => Shop;
  update: (updater: (stash: Shop) => Shop) => void;
  create: (state: Shop) => void;
}

export class ShopHandler {
  constructor(private delegator: ShopHandlerDelegator) {}

  getStash() {
    return new StashHandler({
      get: () => this.delegator.get()!.stash,
      update: stashUpdater => this.delegator.update(evolve({ stash: stashUpdater })),
    });
  }

  get state(): Shop {
    return this.delegator.get();
  }

  update(updater: (stash: Shop) => Shop) {
    this.delegator.update(updater);
  }

  build() {
    if (this.delegator.get() === undefined) {
      this.delegator.create({ level: 1, stash: { resource: { gold: 0 }, items: [] }, items: [] });
    } else {
      this.delegator.update(evolve({ level: inc }));
    }
  }

  generateNewItems(): void {
    const shopItems: ShopItem[] = [];

    const shop = this.delegator.get();

    times(() => {
      const swordWeapon: Weapon = {
        id: generateId(),
        name: "Magic Name",
        effects: [{ effectType: AttackEffectType.Dmg, value: 10 * shop.level, type: EffectType.Static }],
        itemType: ItemType.Weapon,
      };

      const shopItem: ShopItem = {
        id: generateId(),
        price: { gold: shop.level * 10 },
        item: swordWeapon,
        quantity: 1,
      };
      shopItems.push(shopItem);
    }, 30);

    this.delegator.update(evolve({ items: always(shopItems) }));
  }
}
