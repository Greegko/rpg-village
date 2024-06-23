import { Module } from "@rpg-village/core";

import { CastleStore } from "./castle-store";

export const castleModule: Module = {
  stores: [{ scope: "castles", store: CastleStore }],
};
