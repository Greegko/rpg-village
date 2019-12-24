import { injectable } from 'inversify';
import { PartyBase } from './interfaces';
import { EntityStore } from '../../lib';

@injectable()
export class PartyStore<Party extends PartyBase = PartyBase> extends EntityStore<Party> { };
