import { TrainingFieldActivityStartArgs } from "../activities";
import { TrainingFieldActivity } from "../interface";

declare module "@rpg-village/core/features/activity" {
  interface ActivityType {
    [TrainingFieldActivity.Train]: TrainingFieldActivityStartArgs;
  }
}
