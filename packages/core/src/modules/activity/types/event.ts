import { ActivityID } from "../interfaces";

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

declare module "@core" {
  export interface EventType {
    [ActivityEvent.ActivityFinished]: ActivityFinishedActivityArgs;
    [ActivityEvent.ActivityCancelled]: ActivityCancelledActivityArgs;
  }
}
