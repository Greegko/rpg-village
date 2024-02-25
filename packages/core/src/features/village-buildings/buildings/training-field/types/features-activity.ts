import { TrainingFieldActivityStartArgs } from "../activities";
import { TrainingFieldActivity } from "../interface";

declare module "@features/activity" {
  export interface ActivityType {
    [TrainingFieldActivity.Train]: TrainingFieldActivityStartArgs;
  }
}
