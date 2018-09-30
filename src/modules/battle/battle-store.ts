import { injectable } from 'inversify';
import { BattleStoreState, BattleID } from './interfaces';
import { EntityStore } from '@greegko/rpg-model';

@injectable()
export class BattleStore extends EntityStore<BattleStoreState, BattleID> {}
