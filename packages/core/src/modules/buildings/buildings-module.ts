import { Module } from "@core/module";
import { BlacksmithCommandHandler } from "./blacksmith";
import { TrainingFieldTrainActivity, TrainingFieldCommandHandler, TrainingFieldActivity } from "./training-field";

export const buildingsModule: Module = {
  activities: [{ activity: TrainingFieldTrainActivity, name: TrainingFieldActivity.Train }],
  provides: [BlacksmithCommandHandler, TrainingFieldCommandHandler],
};
