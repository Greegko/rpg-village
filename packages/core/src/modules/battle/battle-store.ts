import { injectable } from 'inversify';
import { BattleStoreState, BattleID } from './interfaces';
import { EntityStore } from '../../lib/entity-store';

@injectable()
export class BattleStore extends EntityStore<BattleStoreState, BattleID> { }
