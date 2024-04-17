import { inject, injectable } from "inversify";
import { assoc, forEach, values } from "rambda";

import { EventSystem, GetActivityHandlerToken, commandHandler } from "@rpg-village/core";

import { ActivityStore } from "./activity-store";
import {
  ActivityCancelCommandArgs,
  ActivityCommand,
  ActivityEvent,
  ActivityType,
  AnyActivity,
  GetActivityHandlerByName,
} from "./interfaces";

@injectable()
export class ActivityManager {
  constructor(
    @inject(GetActivityHandlerToken) public getActivityHandler: GetActivityHandlerByName,
    private activityStore: ActivityStore,
    private eventSystem: EventSystem,
  ) {}

  startActivity<Activity extends keyof ActivityType>(
    activityName: Activity,
    startingArgs: ActivityType[Activity] & { targetId?: string; involvedTargetId?: string },
  ) {
    const activityHandler = this.getActivityHandler(activityName);
    if (activityHandler.isRunnable(startingArgs)) {
      const activityState = activityHandler.start(startingArgs);

      this.storeActivity({
        name: activityName,
        state: activityState,
        targetId: (startingArgs as { targetId?: string }).targetId,
        involvedTargetId: (startingArgs as { involvedTargetId?: string }).involvedTargetId,
        startArgs: startingArgs,
      });
    }
  }

  storeActivity<T extends AnyActivity>(activity: Omit<T, "id">): T {
    return this.activityStore.add(activity);
  }

  runActivites() {
    forEach(activity => this.executeActivity(activity), values(this.activityStore.getState()));
  }

  @commandHandler(ActivityCommand.CancelActivity)
  cancelActivity(args: ActivityCancelCommandArgs) {
    const activity = this.activityStore.get(args.activityId);

    const activityHandler = this.getActivityHandler(activity.name);

    if ("isCancelable" in activityHandler && activityHandler.isCancelable(activity)) {
      activityHandler.onCancel(activity);
      this.eventSystem.fire(ActivityEvent.ActivityCancelled, { activityId: args.activityId });
      this.activityStore.remove(args.activityId);
    }
  }

  private executeActivity(activity: AnyActivity) {
    const activityHandler = this.getActivityHandler(activity.name);
    const activityNewState = activityHandler.execute(activity);
    const updatedActivity = assoc("state", activityNewState, activity);
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
