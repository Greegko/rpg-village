import { injectable } from 'inversify';
import { ObjectStore } from "@core/store";
import { GeneralGameStoreState } from './interfaces';

@injectable()
export class GeneralGameStore extends ObjectStore<GeneralGameStoreState> { }
