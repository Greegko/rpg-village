import { Module } from "../../../core-src";
import { WorldStore } from './world-store';
import { ExploreActivity, ExploreBattleActivity, TravelActivity } from "./activites";
import { WorldMap } from "./world-map";

export const worldModule: Module = {
  activities: [
    { type: 'explore', activity: ExploreActivity },
    { type: 'explore-battle', activity: ExploreBattleActivity },
    { type: 'travel', activity: TravelActivity }
  ],
  stores: [{ scope: 'world', store: WorldStore }],
  provides: [WorldMap]
};
