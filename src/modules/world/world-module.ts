import { Module } from "../../models";
import { WorldStore } from './world-store';
import { ExploreActivity, TravelActivity } from "./activites";
import { WorldMap } from "./world-map";
import { WorldCommandHandler } from "./world-command-handler";
import { WorldActivity } from "./interfaces";

export const worldModule: Module = {
  commandHandler: WorldCommandHandler,
  activities: [
    { type: WorldActivity.Explore, activity: ExploreActivity },
    { type: WorldActivity.Travel, activity: TravelActivity }
  ],
  stores: [{ scope: 'world', store: WorldStore }],
  provides: [WorldMap]
};
