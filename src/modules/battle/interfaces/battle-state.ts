import { Entity } from '../../../models';
import { BattleParty } from './battle-party';
import { WithID } from "../../../../core-src";

export interface BattleState {
  party: BattleParty;
  enemyParty: BattleParty;
  units: { [key: string]: WithID<Entity> };
}