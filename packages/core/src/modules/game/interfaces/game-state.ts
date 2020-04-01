import { Party, PartyID } from "../../party";
import { Unit, UnitID } from "../../unit/interfaces";
import { AnyActivity, ActivityID } from '../../activity/interfaces';
import { GeneralGameStoreState } from './general-game-store-state';
import { VillageState } from "../../village";
import { WorldState } from "../../world";
import { BattleStoreState, BattleID } from "../../battle";

export type GameState = {
  activities: Record<ActivityID, AnyActivity>;
  battle: Record<BattleID, BattleStoreState>,
  units: Record<UnitID, Unit>;
  parties: Record<PartyID, Party>;
  general: GeneralGameStoreState;
  village: VillageState;
  world: WorldState;
};
