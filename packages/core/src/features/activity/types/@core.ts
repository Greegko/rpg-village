import {
  Activity,
  ActivityCancelCommandArgs,
  ActivityCancelledActivityArgs,
  ActivityCommand,
  ActivityEvent,
  ActivityFinishedActivityArgs,
  ActivityID,
  ModulActivity,
} from "../interfaces";

declare module "@core" {
  interface CommandType {
    [ActivityCommand.CancelActivity]: ActivityCancelCommandArgs;
  }

  interface EventType {
    [ActivityEvent.ActivityFinished]: ActivityFinishedActivityArgs;
    [ActivityEvent.ActivityCancelled]: ActivityCancelledActivityArgs;
  }

  interface Module {
    activities?: ModulActivity[];
  }

  interface GameState {
    activities: Record<ActivityID, Activity>;
  }
}
