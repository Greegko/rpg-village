import { Module } from "@rpg-village/core";

import { VillageActivityHeal, VillageBuildActivity } from "./activities";
import {
  BlacksmithCommandHandler,
  RuneWorkshopCommandHandler,
  TrainingFieldActivity,
  TrainingFieldCommandHandler,
  TrainingFieldTrainActivity,
} from "./buildings";
import { VillageActivity } from "./interfaces";
import { VillageBuildingsCommandHandler } from "./village-buildings-command-handler";
import { VillageBuildingsEventHandler } from "./village-buildings-event-handler";
import { VillageCommandHandler } from "./village-command-handler";
import { VillageEventHandler } from "./village-event-handler";
import { VillageService } from "./village-service";
import { VillageStore } from "./village-store";

export const villageModule: Module = {
  activities: [
    { name: VillageActivity.Heal, activity: VillageActivityHeal },
    { name: VillageActivity.Build, activity: VillageBuildActivity },
    { name: TrainingFieldActivity.Train, activity: TrainingFieldTrainActivity },
  ],
  stores: [{ scope: "villages", store: VillageStore }],
  provides: [
    VillageService,
    VillageEventHandler,
    VillageCommandHandler,
    VillageBuildingsCommandHandler,
    VillageBuildingsEventHandler,
    BlacksmithCommandHandler,
    TrainingFieldCommandHandler,
    RuneWorkshopCommandHandler,
  ],
};
