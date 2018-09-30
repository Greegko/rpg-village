import { injectable } from 'inversify';
import { PlayerState } from './interfaces';
import { ObjectStore } from '@greegko/rpg-model';

@injectable()
export class PlayerStore extends ObjectStore<PlayerState> {}
