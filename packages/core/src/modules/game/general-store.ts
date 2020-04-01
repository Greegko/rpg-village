import { injectable } from 'inversify';
import { GeneralGameStoreState } from './interfaces';
import { ObjectStore } from "../../lib/object-store";

@injectable()
export class GeneralGameStore extends ObjectStore<GeneralGameStoreState> { }
