import { inject, injectable } from "inversify";
import { assoc, forEach, values } from "rambda";

import { GetActivityHandlerToken, commandHandler } from "@core";

import { PartyStore } from "@modules/party";

import { ActivityStore } from "./activity-store";
import { Activity, ActivityType, GetActivityHandlerByName } from "./interfaces";
import { ActivityCancelCommandArgs, ActivityCommand } from "./interfaces/activity-command";

@injectable()
export class ActivityManager {
  constructor(
    @inject(GetActivityHandlerToken) public getActivityHandler: GetActivityHandlerByName,
    private activityStore: ActivityStore,
    private partyStore: PartyStore,
  ) {}

  startActivity(activityName: string, startingArgs: object) {
    const activityHandler = this.getActivityHandler(activityName);
    if (activityHandler.isRunnable(startingArgs)) {
      const activityState = activityHandler.start(startingArgs);

      this.storeActivity({
        name: activityName,
        state: activityState,
        type: ActivityType.Global,
        startArgs: startingArgs,
      });
    }
  }

  storeActivity<T extends Activity>(activity: Omit<T, "id">): T {
    return this.activityStore.add(activity);
  }

  runActivites() {
    forEach(activity => this.executeActivity(activity), values(this.activityStore.getState()));
  }

  @commandHandler(ActivityCommand.CancelActivity)
  cancelActivity(args: ActivityCancelCommandArgs) {
    const activity = this.activityStore.get(args.activityId);

    const activityHandler = this.getActivityHandler(activity.name);

    if ("isCancelable" in activityHandler && activityHandler?.isCancelable(activity)) {
      activityHandler.onCancel(activity);
      this.activityStore.remove(args.activityId);
      if (activity.type === ActivityType.Party) {
        this.partyStore.update(activity.startArgs.partyId, { activityId: undefined });

        if (activity.startArgs.involvedPartyId) {
          this.partyStore.update(activity.startArgs.involvedPartyId, { activityId: undefined });
        }
      }
    }
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
