import { TrainingFieldActivityStartArgs } from "../activities";
import { TrainingFieldActivity } from "../interface";

declare module "@features/activity" {
  interface ActivityType {
    [TrainingFieldActivity.Train]: TrainingFieldActivityStartArgs;
  }
}
