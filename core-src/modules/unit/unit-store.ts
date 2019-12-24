import { injectable } from 'inversify';
import { UnitBase, UnitID } from './interfaces';
import { EntityStore } from '../../lib';

@injectable()
export class UnitStore<Unit extends UnitBase = UnitBase> extends EntityStore<Unit, UnitID> { };
