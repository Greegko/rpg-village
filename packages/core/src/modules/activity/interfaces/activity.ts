export type ActivityID = string;
export type AnyActivity = Activity<any>;
export enum ActivityType { Party = 'party' };
export type Activity<T> = {
  id: ActivityID;
  state: T;
  name: string;
  type: ActivityType;
}
