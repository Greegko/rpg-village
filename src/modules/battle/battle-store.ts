import { injectable } from 'inversify';
import { BattleID, BattleStoreState, BattleStoreStateItem } from './interfaces';
import { generate } from 'shortid';
import { findIndex, remove, find, propEq } from 'ramda';

const BattleStoreDataInit: BattleStoreState = [];

@injectable()
export class BattleStore {
  private _state: BattleStoreState = BattleStoreDataInit;

  init(state: BattleStoreState) {
    this._state = state;
  }

  getState(): BattleStoreState {
    return this._state;
  }

  getBattle(battleId): BattleStoreStateItem {
    return find(propEq('id', battleId), this._state);
  }

  addBattle({ partyId, enemyPartyId }): BattleID {
    const battleState: BattleStoreStateItem = { partyId, enemyPartyId, id: generate() };

    this._state = [...this._state, battleState];
    return battleState.id;
  }

  removeBattle(battleId: BattleID): void {
    const index = findIndex(propEq('id', battleId), this._state);
    this._state = remove(index, 1, this._state);
  }

}
