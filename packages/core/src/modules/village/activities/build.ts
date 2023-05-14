import { injectable } from "inversify";
import { dec, evolve, inc } from "rambda";

import { EventSystem } from "@core/event";

import { Activity, IActivityHandlerCancelable } from "@modules/activity";
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
export class BuildActivity implements IActivityHandlerCancelable<Activity<BuildState, BuildStartArgs>> {
  constructor(private villageStore: VillageStore, private shopStore: ShopStore, private eventSystem: EventSystem) {}

  start(): BuildState {
    return {
      progress: 100,
    };
  }

  isRunnable(): boolean {
    return true;
  }

  execute({ state }: Activity<BuildState, BuildStartArgs>): BuildState {
    return evolve({ progress: dec }, state);
  }

  isDone({ state: { progress } }: Activity<BuildState, BuildStartArgs>): boolean {
    return progress === 0;
  }

  isCancelable(activity: Activity<BuildState, BuildStartArgs>): boolean {
    return true;
  }

  onCancel(activity: Activity<BuildState, BuildStartArgs>): void {}

  resolve({ startArgs: { targetBuilding } }: Activity<BuildState, BuildStartArgs>) {
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
