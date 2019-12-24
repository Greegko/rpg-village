import { ActivityTask } from './activity-task';
import { PartyID } from '@greegko/rpg-model';

export interface IActivityTaskHandler<S, T> {
  start(party: PartyID, startArgs: S): ActivityTask<any>;
  isRunnable(party: PartyID, startArgs: Partial<S>): boolean;
  getSubTask(activityTask: ActivityTask<T>): ActivityTask<any>;
  isDone(activityTask: ActivityTask<T>): boolean;
  execute(activityTask: ActivityTask<T>): T;
  resolve(activityTask: ActivityTask<T>);
}
