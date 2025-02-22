import { evolve } from "rambda";

import { inject, injectable } from "@rpg-village/core";
import { eventHandler } from "@rpg-village/core";

import { VillageBuilding, VillageEvent, VillageEventBuildingBuiltArgs, VillageService, VillageStore } from "@features/village";

@injectable()
export class VillageBuildingsEventHandler {
  private villageService = inject(VillageService);
  private villageStore = inject(VillageStore);

  @eventHandler(VillageEvent.BuildingBuilt)
  buildingBuilt(args: VillageEventBuildingBuiltArgs) {
    if (args.buildingType === VillageBuilding.Shop) {
      this.villageService.getShop(args.villageId).build();
      return;
    }

    const increase = (val: number | undefined) => (val === undefined ? 1 : val + 1);
    if (args.buildingType === VillageBuilding.PortalSummoningStone) {
      this.villageService.getPortalSummoningStone(args.villageId).build();

      return;
    }

    type NonSpecialHandledBuilding = typeof args.buildingType;

    const buildings = { [args.buildingType]: increase } as Record<NonSpecialHandledBuilding, typeof increase>;
    this.villageStore.update(args.villageId, evolve({ buildings }));
  }

  @eventHandler(VillageEvent.BuildingBuilt)
  onShopCreation({ villageId, buildingType }: VillageEventBuildingBuiltArgs) {
    if (buildingType !== VillageBuilding.Shop) return;

    this.villageService.getShop(villageId).generateNewItems();
  }
}
