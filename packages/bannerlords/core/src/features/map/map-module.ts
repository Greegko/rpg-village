import { Module } from "@rpg-village/core";

import { MapStore } from "./map-store";

export const mapModule: Module = {
  stores: [{ scope: "map", store: MapStore }],
};
