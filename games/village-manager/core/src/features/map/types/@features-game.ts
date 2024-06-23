import "@rpg-village/core";

import { MapID } from "../interfaces";

declare module "@rpg-village/core" {
  interface GeneralGameStoreState {
    worldMapId: MapID;
  }
}
