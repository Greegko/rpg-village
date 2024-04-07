import { injectable } from "inversify";
import { evolve } from "rambda";

import { PortalSummoningStoneHandler } from "@features/buildings/portal-summoning-stone";
import { ShopHandler } from "@features/buildings/shop";
import { StashHandler } from "@features/stash";

import { VillageID } from "./interfaces";
import { VillageStore } from "./village-store";

@injectable()
export class VillageService {
  constructor(private villageStore: VillageStore) {}

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
    });
  }

  getPortalSummoningStone(villageId: VillageID) {
    return new PortalSummoningStoneHandler({
      get: () => this.villageStore.get(villageId).buildings.portalSummoningStone!,
      update: portalSummoningStoneUpdater =>
        this.villageStore.update(
          villageId,
          evolve({ buildings: { portalSummoningStone: portalSummoningStoneUpdater } }),
        ),
    });
  }
}
