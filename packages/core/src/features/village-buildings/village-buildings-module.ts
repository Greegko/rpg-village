import { Module } from "@core";

import { VillageStore } from "@features/village";

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
  stores: [
    {
      scope: "village",
      store: VillageStore,
      initialState: {
        blacksmith: 0,
        portals: 0,
        trainingField: 0,
        runeWorkshop: 0,
        shop: undefined,
      },
    },
  ],
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
