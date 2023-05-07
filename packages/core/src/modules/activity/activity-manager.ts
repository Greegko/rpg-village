import { inject, injectable } from "inversify";
import { assoc, forEach, values } from "rambda";

import { GetActivityHandlerToken } from "@core/module/tokens";

import { PartyStore } from "@modules/party";

import { ActivityStore } from "./activity-store";
import { Activity, ActivityType, GetActivityHandlerByName, PartyActivityStartArgs } from "./interfaces";

@injectable()
export class ActivityManager {
  constructor(
    @inject(GetActivityHandlerToken) private getActivityHandler: GetActivityHandlerByName,
    private activityStore: ActivityStore,
    private partyStore: PartyStore,
  ) {}

  startActivity(activityName: string, startingArgs: object) {
    const activityHandler = this.getActivityHandler(activityName);
    if (activityHandler.isRunnable(startingArgs)) {
      const activityState = activityHandler.start(startingArgs);

      this.activityStore.add({
        name: activityName,
        state: activityState,
        type: ActivityType.Global,
        startArgs: startingArgs,
      });
    }
  }

  startPartyActivity<ActivityStartArgs extends PartyActivityStartArgs>(
    activityName: string,
    startingArgs: ActivityStartArgs,
  ) {
    if (this.partyStore.get(startingArgs.partyId).activityId) return;

    const activityHandler = this.getActivityHandler(activityName);
    if (activityHandler.isRunnable(startingArgs)) {
      const activityState = activityHandler.start(startingArgs);
      const activity = this.activityStore.add({
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

  runActivites() {
    forEach(activity => this.executeActivity(activity), values(this.activityStore.getState()));
  }

  private executeActivity(activity: Activity) {
    const activityHandler = this.getActivityHandler(activity.name);
    const activityNewState = activityHandler.execute(activity);
    const updatedActivity = assoc("state", activityNewState, activity) as Activity;
    const isDone = activityHandler.isDone(updatedActivity);

    if (isDone) {
      activityHandler.resolve(updatedActivity);
      this.activityStore.remove(activity.id);

      if (activity.type === ActivityType.Party) {
        this.partyStore.clearActivity(activity.startArgs.partyId);
        if (activity.startArgs.involvedPartyId) {
          this.partyStore.clearActivity(activity.startArgs.involvedPartyId);
        }
      }
    } else {
      this.activityStore.update(activity.id, updatedActivity);
    }
  }
}
