import { MapID, VillageID } from "@rpg-village/bannerlords";

import { setGameStore } from "../game-store";
import { GamePageType } from "./state";

export function setPage(page: GamePageType, args?: object) {
  setGameStore("ui", "page", { page, args });
}

export function setMap(mapId: MapID) {
  setGameStore("ui", "map", mapId);
}

export function setSelectedVillage(villageId: VillageID) {
  setGameStore("ui", "selectedVillageId", villageId);
}

export function disableAI() {
  setGameStore("ui", "ai", false);
}

export function enableAI() {
  setGameStore("ui", "ai", true);
}

export function pause() {
  setGameStore("ui", "paused", true);
}

export function resume() {
  setGameStore("ui", "paused", false);
}
