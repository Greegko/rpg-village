import { dec, evolve } from "rambda";

import { inject, injectable } from "@rpg-village/core";
import { EventSystem } from "@rpg-village/core";

import { Activity, ActivityHandlerCancelable } from "@rpg-village/features/activity";

import { VillageBuilding, VillageEvent, VillageID } from "../interfaces";

interface BuildState {
  progress: number;
}

export interface VillageActivityBuildStartArgs {
  targetId: VillageID;
  targetBuilding: VillageBuilding;
}

type VillageBuildActivityType = Activity<BuildState, VillageID, null, VillageActivityBuildStartArgs>;

@injectable()
export class VillageBuildActivity implements ActivityHandlerCancelable<VillageBuildActivityType> {
  private eventSystem = inject(EventSystem);

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
    });
  }
}
