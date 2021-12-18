import { Module } from "@core/module";
import { WorldCommandHandler } from "./world-command-handler";
import { WorldActivity } from "./interfaces";
import { WorldStore } from "./world-store";
import { ExploreActivity, TravelActivity } from "./activites";
import { WorldMap } from "./world-map";
import { WorldEventHandler } from "./world-event-handler";

export const worldModule: Module = {
  activities: [
    { name: WorldActivity.Explore, activity: ExploreActivity },
    { name: WorldActivity.Travel, activity: TravelActivity },
  ],
  stores: [{ scope: "world", store: WorldStore }],
  provides: [WorldMap, WorldEventHandler, WorldCommandHandler],
};
