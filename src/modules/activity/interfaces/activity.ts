import { ActivityTask } from './activity-task';

export type ActivityID = string;
export type AnyActivity = Activity<any>;
export type Activity<T> = {
  main: ActivityTask<T>;
  sub: ActivityTask<any>;
}
