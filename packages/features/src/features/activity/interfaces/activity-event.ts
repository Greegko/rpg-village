import { ActivityID } from "./activity";

export interface ActivityFinishedActivityArgs {
  activityId: ActivityID;
}

export interface ActivityCancelledActivityArgs {
  activityId: ActivityID;
}

export enum ActivityEvent {
  ActivityFinished = "activity/activity-finished",
  ActivityCancelled = "activity/activity-cancelled",
}
