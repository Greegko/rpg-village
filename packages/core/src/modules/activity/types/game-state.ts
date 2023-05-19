import "@core/game-state";

import { Activity, ActivityID } from "../interfaces";

declare module "@core/game-state" {
  export interface GameState {
    activities: Record<ActivityID, Activity>;
  }
}
