import { injectable } from "inversify";
import { dec, evolve, inc } from "rambda";

import { EventSystem } from "@core";

import { GlobalActivity, IActivityHandlerCancelable } from "@features/activity";
import { ShopStore } from "@modules/shop";

import { VillageBuilding, VillageEvent } from "../interfaces";
import { VillageStore } from "../village-store";

interface BuildState {
  progress: number;
}

interface BuildStartArgs {
  targetBuilding: VillageBuilding;
}

@injectable()
export class BuildActivity implements IActivityHandlerCancelable<GlobalActivity<BuildState, BuildStartArgs>> {
  constructor(private villageStore: VillageStore, private shopStore: ShopStore, private eventSystem: EventSystem) {}

  start(): BuildState {
    return {
      progress: 100,
    };
  }

  isRunnable(): boolean {
    return true;
  }

  execute({ state }: GlobalActivity<BuildState, BuildStartArgs>): BuildState {
    return evolve({ progress: dec }, state);
  }

  isDone({ state: { progress } }: GlobalActivity<BuildState, BuildStartArgs>): boolean {
    return progress === 0;
  }

  isCancelable(activity: GlobalActivity<BuildState, BuildStartArgs>): boolean {
    return true;
  }

  onCancel(activity: GlobalActivity<BuildState, BuildStartArgs>): void {}

  resolve({ startArgs: { targetBuilding } }: GlobalActivity<BuildState, BuildStartArgs>) {
    if (targetBuilding === "shop") {
      this.villageStore.update(targetBuilding, shop => {
        if (shop) {
          return {
            shopId: shop.shopId,
            level: shop.level + 1,
          };
        }

        return {
          shopId: this.shopStore.add({ items: [] }).id,
          level: 1,
        };
      });

      this.eventSystem.fire(VillageEvent.BuildingBuilt, {
        buildingType: targetBuilding,
        level: this.villageStore.get(targetBuilding).level,
      });
    } else {
      this.villageStore.update(targetBuilding, inc);
      this.eventSystem.fire(VillageEvent.BuildingBuilt, {
        buildingType: targetBuilding,
        level: this.villageStore.get(targetBuilding),
      });
    }
  }
}
