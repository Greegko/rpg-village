import "@rpg-village/core/features/game";

import { MapID } from "../interfaces";

declare module "@rpg-village/core/features/game" {
  interface GeneralGameStoreState {
    worldMapId: MapID;
  }
}
