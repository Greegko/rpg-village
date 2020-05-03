import { inject, injectable } from 'inversify';
import { forEach, values, assoc } from 'ramda';
import { GetActivityHandlerByTag, AnyActivity, ActivityType } from './interfaces';
import { ActivityStore } from './activity-store';

@injectable()
export class ActivityManager {

  constructor(
    @inject('getActivityHandler') private getActivityHandler: GetActivityHandlerByTag,
    @inject('ActivityStore') private activityStore: ActivityStore
  ) { }

  startPartyActivity<T extends { partyId: string }>(activtyName: string, startingArgs: T) {
    const activityHandler = this.getActivityHandler(activtyName);
    if (activityHandler.isRunnable(startingArgs)) {
      const activityState = activityHandler.start(startingArgs);
      this.activityStore.add({ type: ActivityType.Party, name: activtyName, state: activityState });
    }
  }

  runActivites() {
    forEach(activity => this.executeActivity(activity), values(this.activityStore.getState()));
  }

  private executeActivity(activity: AnyActivity) {
    const activityHandler = this.getActivityHandler(activity.name);
    const activityNewState = activityHandler.execute(activity);
    const updatedActivity = assoc('state', activityNewState, activity);
    const isDone = activityHandler.isDone(updatedActivity);

    if (isDone) {
      activityHandler.resolve(updatedActivity);
      this.activityStore.remove(activity.id);
    } else {
      this.activityStore.update(activity.id, updatedActivity);
    }
  }
}
