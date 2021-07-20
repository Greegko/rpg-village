import { Party, PartyID } from "@modules/party";
import { Unit, UnitID } from "@modules/unit";
import { PartyActivity, ActivityID } from "@modules/activity";
import { VillageState } from "@modules/village";
import { WorldState } from "@modules/world";
import { BattleStoreState, BattleID } from "@modules/battle";
import { GeneralGameStoreState } from "./general-game-store-state";

export type GameState = {
  activities: Record<ActivityID, PartyActivity<any>>;
  battle: Record<BattleID, BattleStoreState>;
  units: Record<UnitID, Unit>;
  parties: Record<PartyID, Party>;
  general: GeneralGameStoreState;
  village: VillageState;
  world: WorldState;
};
