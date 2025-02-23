import { dec, evolve } from "rambda";

import { inject } from "@rpg-village/core";
import { EventSystem } from "@rpg-village/core";

import { Activity, ActivityHandlerCancelable, injectableActivity } from "@rpg-village/features/activity";

import { Building, BuildingActivityTargetID, BuildingActivityType, BuildingEvent } from "../interface";

interface BuildState {
  progress: number;
}

export interface BuildStartArgs {
  progress: number;
  building: Building;
  targetId: BuildingActivityTargetID;
}

type BuildingActivityBuildType = Activity<BuildState, BuildingActivityTargetID, null, BuildStartArgs>;

@injectableActivity(BuildingActivityType.Build)
export class BuildingActivityBuild implements ActivityHandlerCancelable<BuildingActivityBuildType> {
  private eventSystem = inject(EventSystem);

  start({ progress }: BuildStartArgs): BuildState {
    return { progress };
  }

  isRunnable(): boolean {
    return true;
  }

  execute({ state }: BuildingActivityBuildType): BuildState {
    return evolve({ progress: dec }, state);
  }

  isDone({ state: { progress } }: BuildingActivityBuildType): boolean {
    return progress === 0;
  }

  isCancelable(activity: BuildingActivityBuildType): boolean {
    return true;
  }

  onCancel(activity: BuildingActivityBuildType): void {}

  resolve({ targetId, startArgs: { building } }: BuildingActivityBuildType) {
    this.eventSystem.fire(BuildingEvent.Built, { targetId, building });
  }
}
