import { Module } from "@core";

import { ActivityManager } from "./activity-manager";
import { ActivityStore } from "./activity-store";

export const activityModule: Module = {
  stores: [{ scope: "activities", store: ActivityStore }],
  provides: [ActivityManager],
};
