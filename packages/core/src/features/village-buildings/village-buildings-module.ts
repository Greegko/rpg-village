import { Module } from "@core";

import {
  BlacksmithCommandHandler,
  GatherResourceFromPortalActivity,
  PortalActivity,
  PortalCommandHandler,
  RuneWorkshopCommandHandler,
  TrainingFieldActivity,
  TrainingFieldCommandHandler,
  TrainingFieldTrainActivity,
  VillageShopEventHandler,
  VillageShopService,
} from "./buildings";
import { VillageBuildingsCommandHandler } from "./village-buildings-command-handler";

export const villageBuildingsModule: Module = {
  activities: [
    { activity: TrainingFieldTrainActivity, name: TrainingFieldActivity.Train },
    { activity: GatherResourceFromPortalActivity, name: PortalActivity.GatherResourceFromPortal },
  ],
  provides: [
    BlacksmithCommandHandler,
    TrainingFieldCommandHandler,
    RuneWorkshopCommandHandler,
    PortalCommandHandler,
    VillageBuildingsCommandHandler,
    VillageShopEventHandler,
    VillageShopService,
  ],
};
