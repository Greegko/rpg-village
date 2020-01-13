import { Party, PartyID } from "../../party";
import { Unit, UnitID } from "../../unit/interfaces";
import { AnyActivity, ActivityID } from '../../activity/interfaces';
import { GeneralGameStoreState } from './general-game-store-state';
import { WithID } from '../../../models';
import { VillageState } from "../../village";
import { WorldState } from "../../world";
import { BattleStoreState, BattleID } from "../../battle";

export type GameState = {
  activities: Record<ActivityID, WithID<AnyActivity>>;
  battle: Record<BattleID, WithID<BattleStoreState>>,
  units: Record<UnitID, WithID<Unit>>;
  parties: Record<PartyID, WithID<Party>>;
  general: GeneralGameStoreState;
  village: VillageState;
  world: WorldState;
};
