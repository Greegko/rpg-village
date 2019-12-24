import { inject, injectable } from 'inversify';
import { forEach, values } from 'ramda';
import { ActivityService } from './activity-service';
import { ActivityTask, GetActivityHandlerByTag, AnyActivity } from './interfaces';
import { ActivityStore } from './activity-store';
import { WithID } from "../../models";

type ActivityTaskResult = [boolean, ActivityTask<any>];

@injectable()
export class ActivityHandler {

  constructor(
    @inject('getActivityHandler') private getActivityHandler: GetActivityHandlerByTag,
    @inject('ActivityStore') private activityStore: ActivityStore,
    @inject('ActivityService') private activityService: ActivityService
  ) { }

  runActivites() {
    forEach(activity => this._executeActivity(activity), values(this.activityStore.getState()));
  }

  private _executeActivity(activity: WithID<AnyActivity>) {
    const isMainActivity = activity.sub === undefined;
    const activeActivityTask = isMainActivity ? activity.main : activity.sub;
    const [isDone, updatedActivityTask] = this._executeActivityTask(activeActivityTask);

    if (isDone) {
      if (isMainActivity) {
        this.activityService.finishMainTask(activity);
      } else {
        this.activityService.finishSubTask(activity);
      }
    } else {
      let updatedActivity: Partial<AnyActivity>;
      if (isMainActivity) {
        updatedActivity = { main: updatedActivityTask };
      } else {
        updatedActivity = { sub: updatedActivityTask };
      }

      this.activityStore.update(activity.id, updatedActivity);
    }
  }

  private _executeActivityTask(activityTask: ActivityTask<any>): ActivityTaskResult {
    const activityHandler = this.getActivityHandler(activityTask.type);
    const activityNewState = activityHandler.execute(activityTask);
    const updatedActivityTask = { ...activityTask, state: activityNewState } as ActivityTask<any>;
    const isDone = activityHandler.isDone(updatedActivityTask);

    if (isDone) {
      activityHandler.resolve(updatedActivityTask);
    }

    return [isDone, updatedActivityTask];
  }

}
