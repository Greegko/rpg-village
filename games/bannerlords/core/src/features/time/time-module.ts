import { Module } from "@rpg-village/core";

import { TimeEventHandler } from "./time-event-handler";

export const timeModule: Module = {
  provides: [TimeEventHandler],
};
