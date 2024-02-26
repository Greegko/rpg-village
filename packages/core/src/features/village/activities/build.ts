import { injectable } from "inversify";
import { dec, evolve } from "rambda";

import { EventSystem } from "@core";

import { Activity, IActivityHandlerCancelable } from "@features/activity";

import { VillageBuilding, VillageEvent, VillageID } from "../interfaces";
import { VillageStore } from "../village-store";

interface BuildState {
  progress: number;
}

export interface VillageActivityBuildStartArgs {
  targetId: VillageID;
  targetBuilding: VillageBuilding;
}

type VillageBuildActivityType = Activity<BuildState, VillageID, null, VillageActivityBuildStartArgs>;

@injectable()
export class VillageBuildActivity implements IActivityHandlerCancelable<VillageBuildActivityType> {
  constructor(private villageStore: VillageStore, private eventSystem: EventSystem) {}

  start(): BuildState {
    return {
      progress: 100,
    };
  }

  isRunnable(): boolean {
    return true;
  }

  execute({ state }: VillageBuildActivityType): BuildState {
    return evolve({ progress: dec }, state);
  }

  isDone({ state: { progress } }: VillageBuildActivityType): boolean {
    return progress === 0;
  }

  isCancelable(activity: VillageBuildActivityType): boolean {
    return true;
  }

  onCancel(activity: VillageBuildActivityType): void {}

  resolve({ targetId, startArgs: { targetBuilding } }: VillageBuildActivityType) {
    this.eventSystem.fire(VillageEvent.BuildingBuilt, {
      villageId: targetId,
      buildingType: targetBuilding,
      level: this.villageStore.get(targetBuilding),
    });
  }
}
