import { ActivityID } from "./activity";

export enum ActivityCommand {
  CancelActivity = "activity/cancel",
}

export interface ActivityCancelCommandArgs {
  activityId: ActivityID;
}

declare module "@core/command" {
  interface CommandType {
    [ActivityCommand.CancelActivity]: ActivityCancelCommandArgs;
  }
}
