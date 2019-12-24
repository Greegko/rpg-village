import { injectable } from 'inversify';
import { PartyBase } from './interfaces';
import { EntityStore } from '../../lib/entity-store';

@injectable()
export class PartyStore<Party extends PartyBase = PartyBase> extends EntityStore<Party> { };
