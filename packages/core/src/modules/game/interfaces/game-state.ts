import { Activity, ActivityID } from "@modules/activity";
import { BattleID, BattleStoreState } from "@modules/battle";
import { Map, MapID, MapLocation, MapLocationID } from "@modules/map";
import { Party, PartyID } from "@modules/party";
import { ShopID, ShopState } from "@modules/shop";
import { Unit, UnitID } from "@modules/unit";
import { VillageState } from "@modules/village";

import { GeneralGameStoreState } from "./general-game-store-state";

export type GameState = {
  activities: Record<ActivityID, Activity>;
  battle: Record<BattleID, BattleStoreState>;
  units: Record<UnitID, Unit>;
  parties: Record<PartyID, Party>;
  general: GeneralGameStoreState;
  village: VillageState;
  maps: Record<MapID, Map>;
  shops: Record<ShopID, ShopState>;
  mapLocations: Record<MapLocationID, MapLocation>;
};
