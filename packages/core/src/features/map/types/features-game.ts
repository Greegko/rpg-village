import "@features/game";

import { MapID } from "../interfaces";

declare module "@features/game" {
  export interface GeneralGameStoreState {
    worldMapId: MapID;
  }
}
