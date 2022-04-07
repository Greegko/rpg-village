import { Module } from "@core/module";
import { BlacksmithCommandHandler } from "./blacksmith";
import { RuneWorkshopCommandHandler } from "./rune-workshop/rune-workshop-command-handler";
import { TrainingFieldTrainActivity, TrainingFieldCommandHandler, TrainingFieldActivity } from "./training-field";

export const villageBuildingsModule: Module = {
  activities: [{ activity: TrainingFieldTrainActivity, name: TrainingFieldActivity.Train }],
  provides: [BlacksmithCommandHandler, TrainingFieldCommandHandler, RuneWorkshopCommandHandler],
};
