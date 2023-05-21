import { injectable } from "inversify";

import { eventHandler } from "@core";

import {
  ActivityCancelledActivityArgs,
  ActivityEvent,
  ActivityFinishedActivityArgs,
  ActivityManager,
  ActivityStore,
  ActivityType,
} from "@modules/activity";
import { PartyStore } from "@modules/party";

import { PartyActivityStartArgs } from "./interfaces";

@injectable()
export class PartyActivityManager {
  constructor(
    private activityManager: ActivityManager,
    private partyStore: PartyStore,
    private activityStore: ActivityStore,
  ) {}

  startPartyActivity<ActivityStartArgs extends PartyActivityStartArgs>(
    activityName: string,
    startingArgs: ActivityStartArgs,
  ) {
    if (this.partyStore.get(startingArgs.partyId).activityId) return;

    const activityHandler = this.activityManager.getActivityHandler(activityName);
    if (activityHandler.isRunnable(startingArgs)) {
      const activityState = activityHandler.start(startingArgs);
      const activity = this.activityManager.storeActivity({
        name: activityName,
        state: activityState,
        type: ActivityType.Party,
        startArgs: startingArgs,
      });

      this.partyStore.setActivity(startingArgs.partyId, activity.id);
      if (startingArgs.involvedPartyId) {
        this.partyStore.setActivity(startingArgs.involvedPartyId, activity.id);
      }
    }
  }

  @eventHandler(ActivityEvent.ActivityFinished)
  onPartyActivityFinish(args: ActivityFinishedActivityArgs) {
    const activity = this.activityStore.get(args.activityId);
    if (activity.type === ActivityType.Party) {
      this.partyStore.clearActivity(activity.startArgs.partyId);
      if (activity.startArgs.involvedPartyId) {
        this.partyStore.clearActivity(activity.startArgs.involvedPartyId);
      }
    }
  }

  @eventHandler(ActivityEvent.ActivityCancelled)
  onPartyActivityCancel(args: ActivityCancelledActivityArgs) {
    const activity = this.activityStore.get(args.activityId);
    if (activity.type === ActivityType.Party) {
      this.partyStore.update(activity.startArgs.partyId, { activityId: undefined });

      if (activity.startArgs.involvedPartyId) {
        this.partyStore.update(activity.startArgs.involvedPartyId, { activityId: undefined });
      }
    }
  }
}
