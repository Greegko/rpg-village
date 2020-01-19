export type ActivityID = string;
export type AnyActivity = Activity<any>;
export type Activity<T> = {
  id: ActivityID;
  state: T;
  type: string;
}
