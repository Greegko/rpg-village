import { injectable, inject } from 'inversify';
import { Activity, ActivityTask, IActivityTaskHandler, AnyActivity } from './interfaces';
import { propEq, values } from 'ramda';
import { PartyService, PartyID, WithID } from '@greegko/rpg-model';
import { ActivityStore } from './activity-store';

@injectable()
export class ActivityService {

  constructor(
    @inject('ActivityStore') private activityStore: ActivityStore,
    @inject('PartyService') private partyService: PartyService<any>,
    @inject('getActivityHandler') private getActivityHandler: (tag: string) => IActivityTaskHandler<any, any>
  ) { }

  getPartyActivity(partyId: PartyID) {
    return values(this.activityStore.getState()).find(propEq('partyId', partyId));
  }

  startActivity<T>(activityTask: ActivityTask<T>) {
    const activity: Activity<T> = {
      main: activityTask,
      sub: this._findLowestSubtask(activityTask)
    };

    this.activityStore.add(activity);
  }

  finishSubTask<T>(activity: WithID<AnyActivity>) {
    if (this._isPartyStillExist(activity.main.partyId)) {
      this.activityStore.update(activity.id, { sub: this._findLowestSubtask(activity.main) });
    } else {
      this.finishMainTask(activity);
    }
  }

  finishMainTask<T>(activity: WithID<AnyActivity>) {
    this.activityStore.remove(activity.id);
  }

  private _findLowestSubtask<T>(activityTask: ActivityTask<T>): ActivityTask<T> {
    if (activityTask === undefined) return undefined;

    const activityTaskHandler = this.getActivityHandler(activityTask.type);
    const subTask = activityTaskHandler.getSubTask(activityTask);

    const subSubTask = this._findLowestSubtask(subTask);
    return subSubTask ? subSubTask : subTask;
  }

  private _isPartyStillExist(partyId: PartyID): boolean {
    return this.partyService.getParty(partyId) !== undefined;
  }

}
