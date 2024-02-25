import { injectable } from "inversify";
import { dec, evolve } from "rambda";

import { EventSystem } from "@core";

import { Activity, IActivityHandlerCancelable } from "@features/activity";

import { VillageBuilding, VillageEvent } from "../interfaces";
import { VillageStore } from "../village-store";

interface BuildState {
  progress: number;
}

export interface VillageActivityBuildStartArgs {
  targetBuilding: VillageBuilding;
}

@injectable()
export class VillageBuildActivity
  implements IActivityHandlerCancelable<Activity<BuildState, VillageActivityBuildStartArgs>>
{
  constructor(private villageStore: VillageStore, private eventSystem: EventSystem) {}

  start(): BuildState {
    return {
      progress: 100,
    };
  }

  isRunnable(): boolean {
    return true;
  }

  execute({ state }: Activity<BuildState, VillageActivityBuildStartArgs>): BuildState {
    return evolve({ progress: dec }, state);
  }

  isDone({ state: { progress } }: Activity<BuildState, VillageActivityBuildStartArgs>): boolean {
    return progress === 0;
  }

  isCancelable(activity: Activity<BuildState, VillageActivityBuildStartArgs>): boolean {
    return true;
  }

  onCancel(activity: Activity<BuildState, VillageActivityBuildStartArgs>): void {}

  resolve({ startArgs: { targetBuilding } }: Activity<BuildState, VillageActivityBuildStartArgs>) {
    this.eventSystem.fire(VillageEvent.BuildingBuilt, {
      buildingType: targetBuilding,
      level: this.villageStore.get(targetBuilding),
    });
  }
}
