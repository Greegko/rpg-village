import { Activity, ActivityID } from "../interfaces";

declare module "@core" {
  export interface GameState {
    activities: Record<ActivityID, Activity>;
  }
}
