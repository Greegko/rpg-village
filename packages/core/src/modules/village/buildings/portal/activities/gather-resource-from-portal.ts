import { injectable } from "inversify";
import { dec, evolve } from "rambda";

import { Resource } from "@models/resource";
import { Activity, IActivityHandler } from "@modules/activity";

import { VillageStashService } from "../../../village-stash-service";

interface GatherResourceFromPortalState {
  progress: number;
}

interface GatherResourceFromPortalStartArgs {
  resource: Resource;
}

@injectable()
export class GatherResourceFromPortalActivity
  implements IActivityHandler<Activity<GatherResourceFromPortalState, GatherResourceFromPortalStartArgs>>
{
  constructor(private villageStashService: VillageStashService) {}

  start(): GatherResourceFromPortalState {
    return {
      progress: 250,
    };
  }

  isRunnable(): boolean {
    return true;
  }

  execute({
    state,
  }: Activity<GatherResourceFromPortalState, GatherResourceFromPortalStartArgs>): GatherResourceFromPortalState {
    return evolve({ progress: dec }, state);
  }

  isDone({ state: { progress } }: Activity<GatherResourceFromPortalState, GatherResourceFromPortalStartArgs>): boolean {
    return progress === 0;
  }

  resolve({ startArgs: { resource } }: Activity<GatherResourceFromPortalState, GatherResourceFromPortalStartArgs>) {
    this.villageStashService.addResource(resource);
  }
}
