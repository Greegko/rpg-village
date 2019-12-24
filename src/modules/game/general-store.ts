import { injectable } from 'inversify';
import { GeneralGameStoreState } from './interfaces';
import { ObjectStore } from "../../../core-src";

@injectable()
export class GeneralGameStore extends ObjectStore<GeneralGameStoreState> { }
