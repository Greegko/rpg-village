import { Module } from "../../models";
import { WorldStore } from './world-store';
import { ExploreActivity, TravelActivity } from "./activites";
import { WorldMap } from "./world-map";

export const worldModule: Module = {
  activities: [
    { type: 'explore', activity: ExploreActivity },
    { type: 'travel', activity: TravelActivity }
  ],
  stores: [{ scope: 'world', store: WorldStore }],
  provides: [WorldMap]
};
