import { injectable } from "inversify";
import { dec, evolve } from "rambda";

import { Resource } from "@models";
import { GlobalActivity, IActivityHandler } from "@modules/activity";

import { VillageStashService } from "../../../village-stash-service";

interface GatherResourceFromPortalState {
  progress: number;
}

interface GatherResourceFromPortalStartArgs {
  resource: Resource;
}

@injectable()
export class GatherResourceFromPortalActivity
  implements IActivityHandler<GlobalActivity<GatherResourceFromPortalState, GatherResourceFromPortalStartArgs>>
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
  }: GlobalActivity<GatherResourceFromPortalState, GatherResourceFromPortalStartArgs>): GatherResourceFromPortalState {
    return evolve({ progress: dec }, state);
  }

  isDone({
    state: { progress },
  }: GlobalActivity<GatherResourceFromPortalState, GatherResourceFromPortalStartArgs>): boolean {
    return progress === 0;
  }

  resolve({
    startArgs: { resource },
  }: GlobalActivity<GatherResourceFromPortalState, GatherResourceFromPortalStartArgs>) {
    this.villageStashService.addResource(resource);
  }
}
