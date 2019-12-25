import { injectable } from 'inversify';
import { Unit, UnitID } from './interfaces';
import { EntityStore } from '../../../src/lib/entity-store';

@injectable()
export class UnitStore extends EntityStore<Unit, UnitID> { };
