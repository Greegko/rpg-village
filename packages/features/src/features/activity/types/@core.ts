import {
  ActivityCancelCommandArgs,
  ActivityCancelledActivityArgs,
  ActivityCommand,
  ActivityEvent,
  ActivityFinishedActivityArgs,
  ActivityID,
  AnyActivity,
  ModulActivity,
} from "../interfaces";

declare module "@rpg-village/core/extend" {
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
    activities: Record<ActivityID, AnyActivity>;
  }
}
