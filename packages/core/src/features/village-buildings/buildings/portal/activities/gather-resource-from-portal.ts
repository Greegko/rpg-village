import { injectable } from "inversify";
import { dec, evolve } from "rambda";

import { Activity, IActivityHandler } from "@features/activity";
import { VillageStashService } from "@features/village";
import { Resource } from "@models";

interface GatherResourceFromPortalState {
  progress: number;
}

export interface GatherResourceFromPortalActivityStartArgs {
  resource: Resource;
}

@injectable()
export class GatherResourceFromPortalActivity
  implements IActivityHandler<Activity<GatherResourceFromPortalState, GatherResourceFromPortalActivityStartArgs>>
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
  }: Activity<
    GatherResourceFromPortalState,
    GatherResourceFromPortalActivityStartArgs
  >): GatherResourceFromPortalState {
    return evolve({ progress: dec }, state);
  }

  isDone({
    state: { progress },
  }: Activity<GatherResourceFromPortalState, GatherResourceFromPortalActivityStartArgs>): boolean {
    return progress === 0;
  }

  resolve({
    startArgs: { resource },
  }: Activity<GatherResourceFromPortalState, GatherResourceFromPortalActivityStartArgs>) {
    this.villageStashService.addResource(resource);
  }
}
