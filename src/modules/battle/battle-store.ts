import { injectable } from 'inversify';
import { BattleStoreState, BattleID } from './interfaces';
import { EntityStore } from '../../../core-src';

@injectable()
export class BattleStore extends EntityStore<BattleStoreState, BattleID> { }
