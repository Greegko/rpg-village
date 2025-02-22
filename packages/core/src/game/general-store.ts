import { ObjectStore } from "@core";
import { injectable } from "@lib/dependency-injection";

import { GeneralGameStoreState } from "./interfaces";

@injectable()
export class GeneralGameStore extends ObjectStore<GeneralGameStoreState> {}
