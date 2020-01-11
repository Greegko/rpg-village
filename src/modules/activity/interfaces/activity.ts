export type ActivityID = string;
export type AnyActivity = Activity<any>;
export type Activity<T> = {
  state: T;
  type: string;
}
