import { inject, injectable } from 'inversify';
import { forEach, values, assoc } from 'ramda';
import { GetActivityHandlerByTag, AnyActivity } from './interfaces';
import { ActivityStore } from './activity-store';
import { WithID } from '../../models';

@injectable()
export class ActivityManager {

  constructor(
    @inject('getActivityHandler') private getActivityHandler: GetActivityHandlerByTag,
    @inject('ActivityStore') private activityStore: ActivityStore
  ) { }

  startActivity(activityType: string, startingArgs: any) {
    const activityHandler = this.getActivityHandler(activityType);
    if (activityHandler.isRunnable(startingArgs)) {
      const activityState = activityHandler.start(startingArgs);
      this.activityStore.add({ type: activityType, state: activityState });
    }
  }

  runActivites() {
    forEach(activity => this.executeActivity(activity), values(this.activityStore.getState()));
  }

  private executeActivity(activity: WithID<AnyActivity>) {
    const activityHandler = this.getActivityHandler(activity.type);
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
