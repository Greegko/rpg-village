import { Module } from "@greegko/rpg-model";
import { ActivityHandler } from "./activity-handler";
import { ActivityService } from "./activity-service";
import { ActivityStore } from './activity-store';

export const activityModule: Module = {
  stores: [{ scope: 'activity', store: ActivityStore }],
  provides: [ActivityHandler, ActivityService]
};
