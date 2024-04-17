import { TrainingFieldActivityStartArgs } from "../activities";
import { TrainingFieldActivity } from "../interface";

declare module "@rpg-village/features/activity" {
  interface ActivityType {
    [TrainingFieldActivity.Train]: TrainingFieldActivityStartArgs;
  }
}
