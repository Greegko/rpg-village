import { injectable } from 'inversify';
import { Party } from './interfaces';
import { EntityStore } from '../../lib/entity-store';

@injectable()
export class PartyStore extends EntityStore<Party> { };
