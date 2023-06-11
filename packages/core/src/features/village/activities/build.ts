import { injectable } from "inversify";
import { dec, evolve } from "rambda";

import { EventSystem } from "@core";

import { GlobalActivity, IActivityHandlerCancelable } from "@features/activity";

import { VillageBuilding, VillageEvent } from "../interfaces";
import { VillageStore } from "../village-store";

interface BuildState {
  progress: number;
}

interface BuildStartArgs {
  targetBuilding: VillageBuilding;
}

@injectable()
export class VillageBuildActivity implements IActivityHandlerCancelable<GlobalActivity<BuildState, BuildStartArgs>> {
  constructor(private villageStore: VillageStore, private eventSystem: EventSystem) {}

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
    this.eventSystem.fire(VillageEvent.BuildingBuilt, {
      buildingType: targetBuilding,
      level: this.villageStore.get(targetBuilding),
    });
  }
}
