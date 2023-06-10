import { inject, injectable } from "inversify";
import { assoc, forEach, values } from "rambda";

import { EventSystem, GetActivityHandlerToken, commandHandler } from "@core";

import { ActivityStore } from "./activity-store";
import {
  Activity,
  ActivityCancelCommandArgs,
  ActivityCommand,
  ActivityType,
  GetActivityHandlerByName,
} from "./interfaces";
import { ActivityEvent } from "./types/event";

@injectable()
export class ActivityManager {
  constructor(
    @inject(GetActivityHandlerToken) public getActivityHandler: GetActivityHandlerByName,
    private activityStore: ActivityStore,
    private eventSystem: EventSystem,
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
      this.eventSystem.fire(ActivityEvent.ActivityCancelled, { activityId: args.activityId });
      this.activityStore.remove(args.activityId);
    }
  }

  private executeActivity(activity: Activity) {
    const activityHandler = this.getActivityHandler(activity.name);
    const activityNewState = activityHandler.execute(activity);
    const updatedActivity = assoc("state", activityNewState, activity) as Activity;
    const isDone = activityHandler.isDone(updatedActivity);

    if (isDone) {
      activityHandler.resolve(updatedActivity);
      this.eventSystem.fire(ActivityEvent.ActivityFinished, { activityId: activity.id });
      this.activityStore.remove(activity.id);
    } else {
      this.activityStore.update(activity.id, updatedActivity);
    }
  }
}
