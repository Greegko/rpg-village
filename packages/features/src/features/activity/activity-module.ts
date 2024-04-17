import { Module } from "@rpg-village/core";

import { ActivityCommandHandler } from "./activity-command-handler";
import { ActivityManager } from "./activity-manager";
import { ActivityStore } from "./activity-store";

export const activityModule: Module = {
  stores: [{ scope: "activities", store: ActivityStore }],
  provides: [ActivityManager, ActivityCommandHandler],
};
