import { injectable } from "inversify";
import { dec, evolve, inc } from "rambda";

import { Activity, IActivityHandler } from "@modules/activity";

import { VillageStore } from "../village-store";

interface BuildState {
  progress: number;
}

export type VillageBuildings = "houses" | "blacksmith" | "portals" | "trainingField" | "runeWorkshop";

interface BuildStartArgs {
  targetBuilding: VillageBuildings;
}

@injectable()
export class BuildActivity implements IActivityHandler<Activity<BuildState, BuildStartArgs>> {
  constructor(private villageStore: VillageStore) {}

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

  resolve({ startArgs: { targetBuilding } }: Activity<BuildState, BuildStartArgs>) {
    this.villageStore.update(targetBuilding, inc);
  }
}
