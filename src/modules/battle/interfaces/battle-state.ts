import { Entity } from '../../../models';
import { BattleParty } from './battle-party';
import { WithID } from '@greegko/rpg-model';

export interface BattleState {
  party: BattleParty;
  enemyParty: BattleParty;
  units: { [key: string]: WithID<Entity> };
}