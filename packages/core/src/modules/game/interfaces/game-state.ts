import { Party, PartyID } from "@modules/party";
import { Unit, UnitID } from "@modules/unit";
import { PartyActivity, ActivityID } from "@modules/activity";
import { VillageState } from "@modules/village";
import { Map, MapID, MapLocation, MapLocationID } from "@modules/map";
import { BattleStoreState, BattleID } from "@modules/battle";
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
