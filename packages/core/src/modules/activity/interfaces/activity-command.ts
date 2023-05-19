import { ActivityID } from "./activity";

export enum ActivityCommand {
  CancelActivity = "activity/cancel",
}

export interface ActivityCancelCommandArgs {
  activityId: ActivityID;
}
