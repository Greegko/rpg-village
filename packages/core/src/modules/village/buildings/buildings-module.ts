import { Module } from "@core/module";
import { BlacksmithCommandHandler } from "./blacksmith";
import { PortalsCommandHandler } from "./portals";
import { RuneWorkshopCommandHandler } from "./rune-workshop";
import { TrainingFieldTrainActivity, TrainingFieldCommandHandler, TrainingFieldActivity } from "./training-field";

export const villageBuildingsModule: Module = {
  activities: [{ activity: TrainingFieldTrainActivity, name: TrainingFieldActivity.Train }],
  provides: [BlacksmithCommandHandler, TrainingFieldCommandHandler, RuneWorkshopCommandHandler, PortalsCommandHandler],
};
