import { PartyID } from '@greegko/rpg-model';
import { BattleID } from './battle-id';

export type BattleStoreStateItem = {
  id: BattleID;
  partyId: PartyID;
  enemyPartyId: PartyID;
}

export type BattleStoreState = BattleStoreStateItem[]; 
