import { injectable } from 'inversify';
import { VillageState } from './interfaces';
import { ObjectStore } from "../../lib/object-store";

@injectable()
export class VillageStore extends ObjectStore<VillageState> { }
