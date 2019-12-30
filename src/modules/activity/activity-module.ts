import { Module } from "../../models";
import { ActivityHandler } from "./activity-handler";
import { ActivityStore } from './activity-store';

export const activityModule: Module = {
  stores: [{ scope: 'activity', store: ActivityStore }],
  provides: [ActivityHandler]
};
