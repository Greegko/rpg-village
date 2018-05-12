import { injectable } from 'inversify';
import { assoc } from 'ramda';
import { PlayerStoreState } from './interfaces';
import { StashID, Store } from '@greegko/rpg-model';

@injectable()
export class PlayerStore implements Store<PlayerStoreState> {
  private _state: PlayerStoreState = { stashId: undefined };

  init(state: PlayerStoreState): void {
    this._state = state;
  }

  getState(): PlayerStoreState {
    return this._state;
  }

  assignStash(stashId: StashID): void { 
    this._state = assoc('stashId', stashId, this._state);
  }
}
