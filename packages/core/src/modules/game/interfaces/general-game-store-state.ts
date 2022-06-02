import { MapID } from "@modules/map";

import { Turn } from "./turn";

export interface GeneralGameStoreState {
  turn: Turn;
  worldMapId: MapID;
}
