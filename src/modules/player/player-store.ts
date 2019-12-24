import { injectable } from 'inversify';
import { PlayerState } from './interfaces';
import { ObjectStore } from "../../lib/object-store";

@injectable()
export class PlayerStore extends ObjectStore<PlayerState> { }
