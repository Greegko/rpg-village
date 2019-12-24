import { injectable } from 'inversify';
import { PlayerState } from './interfaces';
import { ObjectStore } from "../../../core-src";

@injectable()
export class PlayerStore extends ObjectStore<PlayerState> { }
