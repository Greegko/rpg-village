import { Module } from "@rpg-village/core";

import { FractionStore } from "./fraction-store";

export const fractionModule: Module = {
  stores: [{ scope: "fractions", store: FractionStore }],
};
