import { injectable } from 'inversify';
import { EntityStore } from '../../../src/lib/entity-store';
import { StashID } from './interfaces';

@injectable()
export class StashStore<Stash extends object> extends EntityStore<Stash, StashID> { }
