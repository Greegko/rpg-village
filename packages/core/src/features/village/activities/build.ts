import { injectable } from "inversify";
import { dec, evolve } from "rambda";

import { EventSystem } from "@core";

import { Activity, IActivityHandlerCancelable } from "@features/activity";

import { VillageBuilding, VillageEvent } from "../interfaces";
import { VillageStore } from "../village-store";

interface BuildState {
  progress: number;
}

interface BuildStartArgs {
  targetBuilding: VillageBuilding;
}

@injectable()
export class VillageBuildActivity implements IActivityHandlerCancelable<Activity<BuildState, BuildStartArgs>> {
  constructor(private villageStore: VillageStore, private eventSystem: EventSystem) {}

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
    this.eventSystem.fire(VillageEvent.BuildingBuilt, {
      buildingType: targetBuilding,
      level: this.villageStore.get(targetBuilding),
    });
  }
}
