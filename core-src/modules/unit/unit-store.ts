import { injectable } from 'inversify';
import { UnitBase, UnitID } from './interfaces';
import { EntityStore } from '../../../src/lib/entity-store';

@injectable()
export class UnitStore<Unit extends UnitBase = UnitBase> extends EntityStore<Unit, UnitID> { };
