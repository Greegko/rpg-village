import "@features/game";

import { MapID } from "../interfaces";

declare module "@features/game" {
  interface GeneralGameStoreState {
    worldMapId: MapID;
  }
}
