import { evolve, lensPath, set } from "rambda";

import { inject, injectable } from "@rpg-village/core";

import { PortalSummoningStoneHandler } from "@features/buildings/portal-summoning-stone";
import { ShopHandler } from "@features/buildings/shop";
import { StashHandler } from "@features/stash";

import { VillageID } from "./interfaces";
import { VillageStore } from "./village-store";

@injectable()
export class VillageService {
  private villageStore = inject(VillageStore);

  getStash(villageId: VillageID) {
    return new StashHandler({
      get: () => this.villageStore.get(villageId).stash,
      update: stashUpdater => this.villageStore.update(villageId, evolve({ stash: stashUpdater })),
    });
  }

  getShop(villageId: VillageID) {
    return new ShopHandler({
      get: () => this.villageStore.get(villageId).buildings.shop!,
      update: shopUpdater => this.villageStore.update(villageId, evolve({ buildings: { shop: shopUpdater } })),
      create: state => this.villageStore.update(villageId, set(lensPath("buildings.shop"), state)),
    });
  }

  getPortalSummoningStone(villageId: VillageID) {
    return new PortalSummoningStoneHandler({
      get: () => this.villageStore.get(villageId).buildings.portalSummoningStone!,
      update: portalSummoningStoneUpdater =>
        this.villageStore.update(villageId, evolve({ buildings: { portalSummoningStone: portalSummoningStoneUpdater } })),
      create: state => this.villageStore.update(villageId, set(lensPath("buildings.portalSummoningStone"), state)),
    });
  }
}
