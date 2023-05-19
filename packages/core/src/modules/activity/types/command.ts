import { ActivityCancelCommandArgs, ActivityCommand } from "../interfaces";

declare module "@core" {
  export interface CommandType {
    [ActivityCommand.CancelActivity]: ActivityCancelCommandArgs;
  }
}
