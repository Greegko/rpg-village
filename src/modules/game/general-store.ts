import { injectable } from 'inversify';
import { GeneralGameStoreState } from './interfaces';
import { ObjectStore } from '@greegko/rpg-model';

@injectable()
export class GeneralGameStore extends ObjectStore<GeneralGameStoreState> { }
