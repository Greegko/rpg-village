import { ActivityID, PartyActivity } from "@modules/activity";
import { BattleID, BattleStoreState } from "@modules/battle";
import { Map, MapID, MapLocation, MapLocationID } from "@modules/map";
import { Party, PartyID } from "@modules/party";
import { Unit, UnitID } from "@modules/unit";
import { VillageState } from "@modules/village";

import { GeneralGameStoreState } from "./general-game-store-state";

export type GameState = {
  activities: Record<ActivityID, PartyActivity<any>>;
  battle: Record<BattleID, BattleStoreState>;
  units: Record<UnitID, Unit>;
  parties: Record<PartyID, Party>;
  general: GeneralGameStoreState;
  village: VillageState;
  maps: Record<MapID, Map>;
  mapLocations: Record<MapLocationID, MapLocation>;
};
