import { injectable } from "inversify";
import { dec, evolve } from "rambda";

import { Activity, IActivityHandler } from "@features/activity";
import { MapID } from "@features/map";
import { VillageID, VillageStashService } from "@features/village";
import { Resource } from "@models";

interface GatherResourceFromPortalState {
  progress: number;
}

export interface GatherResourceFromPortalActivityStartArgs {
  resource: Resource;
  targetId: MapID;
  involvedTargetId: VillageID;
}

type GatherResourceActivityType = Activity<
  GatherResourceFromPortalState,
  MapID,
  VillageID,
  GatherResourceFromPortalActivityStartArgs
>;

@injectable()
export class GatherResourceFromPortalActivity implements IActivityHandler<GatherResourceActivityType> {
  constructor(private villageStashService: VillageStashService) {}

  start(): GatherResourceFromPortalState {
    return {
      progress: 250,
    };
  }

  isRunnable(): boolean {
    return true;
  }

  execute({ state }: GatherResourceActivityType): GatherResourceFromPortalState {
    return evolve({ progress: dec }, state);
  }

  isDone({ state: { progress } }: GatherResourceActivityType): boolean {
    return progress === 0;
  }

  resolve({ startArgs: { resource } }: GatherResourceActivityType) {
    this.villageStashService.addResource(resource);
  }
}
