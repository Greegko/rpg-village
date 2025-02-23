import "@features/castle";
import "@features/clan";
import "@features/fraction";
import "@features/lord";
import "@features/map";
import "@features/party";
import "@features/time";
import "@features/town";
import "@features/village";

export { TownCommand } from "@features/town";
export { VillageCommand } from "@features/village";
export { type Party } from "@features/party";
export { MapCommand } from "@features/map";

export type { GameState, Command } from "@rpg-village/core";
export { createGameInstance } from "@rpg-village/core";
export * from "./game";
