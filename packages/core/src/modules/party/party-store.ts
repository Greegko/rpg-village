import { injectable } from 'inversify';
import { EntityStore } from '@core/store';
import { Party } from './interfaces';

@injectable()
export class PartyStore extends EntityStore<Party> { };
