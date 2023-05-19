import "@core/command";

import { ActivityCancelCommandArgs, ActivityCommand } from "../interfaces";

declare module "@core/command" {
  export interface CommandType {
    [ActivityCommand.CancelActivity]: ActivityCancelCommandArgs;
  }
}
