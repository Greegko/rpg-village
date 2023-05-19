import "@core/command";

import { ActivityCancelCommandArgs, ActivityCommand } from "../interfaces";

declare module "@core/command" {
  interface CommandType {
    [ActivityCommand.CancelActivity]: ActivityCancelCommandArgs;
  }
}
